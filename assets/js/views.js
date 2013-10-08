var CaueViews = {};

var map;

CaueViews.pointToLayer = function(featureData, latlng) {
  // Use SVG Markers instead of Leaflet standard ones to allow theming
  return L.circleMarker(latlng);
};

CaueViews.displayHomePage = function() {
  // Create base map
  map = new L.Map('map').setView([45, 0.67], 9);
  map.attributionControl.setPrefix('Par <a href="http://makina-corpus.com">Makina Corpus</a>');
  // Add Base Layer
  var caueUrl = 'http://82.196.6.196/CAUE24/{z}/{x}/{y}.png';
  var caueAttrib = 'Données cartographiques fournies par le <a href="http://www.cauedordogne.com" target="_blank">CAUE24</a>';
  L.tileLayer(caueUrl, {minZoom: 8, maxZoom: 11, attribution: caueAttrib}).addTo(map);
  // Add GeoJSON Layer
  var info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
  };

  // method that we will use to update the control based on feature properties passed
  info.update = function (props) {
    if (props) {
      var cdc = props.TYPOLOGIE2.toFixed();
      var realCdc = $('.dropdown-menu li:nth-child('+cdc+') a').text();
      this._div.innerHTML = realCdc;
    } else {
      this._div.innerHTML = 'Survolez une communauté de commune';
    }
  };

  info.addTo(map);
  function highlightFeature(e) {
    var layer = e.target;
    info.update(layer.feature.properties);
  }
  function resetHighlight(e) {
    info.update();
  }
  function onEachFeature(feature, layer) {
    if (feature.properties) {
      var properties = feature.properties;
    }
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: function(e) {
        var cdc = properties.TYPOLOGIE2.toFixed();
        var realCdc = $('.dropdown-menu li:nth-child('+cdc+') a').attr('href');
        location.hash = realCdc;
      },
    });
  }
  $.ajax({
    type: "GET",
    url: "data/geojson/home.geojson",
    dataType: 'json',
    success: function (response) {
      var geojsonLayer = L.geoJson(response, {onEachFeature: onEachFeature}).addTo(map);
      map.fitBounds(geojsonLayer.getBounds());
    }
  });
};

CaueViews.displayMapPage = function(community, category) {
  // Create base map
  map = new L.Map('map').setView([45, 0.67], 10);
  map.attributionControl.setPrefix('Par <a href="http://makina-corpus.com">Makina Corpus</a>');
  // Add Base Layer
  var caueUrl = 'http://82.196.6.196/CAUE24_Cromagnon_portrait/{z}/{x}/{y}.png';
  var caueAttrib = 'Données cartographiques fournies par le <a href="http://www.cauedordogne.com" target="_blank">CAUE24</a>';
  L.tileLayer(caueUrl, {minZoom: 10, maxZoom: 16, attribution: caueAttrib}).addTo(map);
  // Add GeoJSON Layer
  $.ajax({
    type: "GET",
    url: "data/geojson/" + community + "_" + category + ".geojson",
    dataType: 'json',
    success: function (response) {
      var geojsonLayer = L.geoJson(response, {pointToLayer: CaueViews.pointToLayer}).addTo(map);
      map.fitBounds(geojsonLayer.getBounds());
    }
  });
};

CaueViews.displayData = function(layer, rawHtml, id) {
  var dom$ = $(rawHtml);
  // Parse data
  var popupTitle = dom$.find('.popuptitle').text();
  var popupContent = dom$.find('.popupcontent').text();
  var additionalText = dom$.find('.additionaltext').text();
  var photos = dom$.find('.images').text();
  // Raise events
  layer.bindPopup('<h2>'+ id + ': ' + popupTitle +'</h2>' + popupContent).openPopup();
  $('#map-infos').html(id + ': ' + additionalText);
  $('#map-photos').html(id + ': ' + photos);
};

CaueViews.displayError = function(featureId) {
  $('#map-photos').html("Créez un contenu pour cet élement en allant sur <a href='http://prose.io/#makinacorpus/caue24/new/gh-pages/data/" + featureId + ".md'>cette page</a>.");
};

CaueViews.clickLayer = function(layer, id) {
  // Get id Jekyll page
  var layerHash = L.Util.hash(layer),
      featureId = layerHash.substring(0, 6);
  // Get page content
  $.ajax({
    //url: "http://localhost:4000/data/" + featureId + ".html",
    url: "http://makinacorpus.github.io/caue24/data/test-page.html",
  }).done(function(data) {
      CaueViews.displayData(layer, data, id);
  }).fail(function(jqXHR, textStatus, errorThrown) {
      CaueViews.displayError(featureId);
  });
};

(function (Backbone, _, $, undefined) {
  "use strict";

  Backbone.$ = $;

  var CaueApp = Backbone.Router.extend({

    routes: {
        "":                         "home",
        ":communaute(/:category)":  "map"
    },

    home: function() {
      // Reset community select text
      $('button.dropdown-toggle:first').text('Choisissez une communauté de commune');
      // Hide additionnal blocks
      $('#map-infos').hide();
      $('#map-photos').hide();
      $('.navbar').hide();
      // Show home teasing text
      $('#teasing').show();
      // Extend map
      $('#map').css('bottom', '60px');
      $('#map').css('top', '60px');
      // Remove eventual existing map
      if (map instanceof L.Map) {
        map.remove();
      }
      // Display map
      CaueViews.displayHomePage();
      // Nothing else to do
    },

    map: function(community, category) {
      // Get community label
      var myCommunity = $('.dropdown-menu').find('a[href="#'+community+'"]').text();
      // Set it as button label
      $('button.dropdown-toggle:first').text(myCommunity);
      // Eventually use default category if not present
      var myCategory = category;
      if (myCategory === null) {
        myCategory = 'portrait';
        this.navigate(community + '/' + myCategory, {trigger: true, replace: true});
      }
      // Update links so they point to the right community
      $('.nav li').each(function () {
        $('a', this).attr('href', '#' + community + '/' + $(this).attr('class'));
      });
      // Change active category
      $('.nav li').removeClass('active');
      $('.nav li.' + myCategory).addClass('active');
      // Set category class on body field so everything is correctly themed
      $('body').removeClass().addClass(myCategory);
      // Display additionnal blocks
      $('#map-infos').show();
      $('#map-photos').show();
      $('.navbar').show();
      // Hide home teasing text
      $('#teasing').hide();
      // Reduce map
      $('#map').css('bottom', '210px');
      $('#map').css('top', '100px');
      // Remove eventual existing map
      if (map instanceof L.Map) {
        map.remove();
      }
      // Display map
      CaueViews.displayMapPage(community, category);
      // Nothing else to do
    }
  });

  var app = new CaueApp();
  Backbone.history.start();

})(Backbone,  _, jQuery);
