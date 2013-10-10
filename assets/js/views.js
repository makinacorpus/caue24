var CaueViews = {};

var map;

CaueViews.initMap = function(category) {
  // Remove eventual existing map
  if (map instanceof L.Map) {
    map.remove();
  }
  // Init new one
  map = L.map('map');
  // Attribution
  map.attributionControl.setPrefix('Par <a href="http://makina-corpus.com">Makina Corpus</a>');
  // Legend
  if (category !== null) {
    CaueViews.addLegend(category);
  }
  // Scale
  L.control.scale({imperial: false}).addTo(map);
}

CaueViews.addLegend = function(category) {
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    if (category == 'geographie') {
      div.innerHTML += '<h4>Légende</h4>';
      div.innerHTML += '<i style="background:#EAE2E1"></i>Alluvions<br />';
      div.innerHTML += '<i style="background:#C2B6B3"></i>Terrasses alluviales<br />';
      div.innerHTML += '<i style="background:#FFE595"></i>Altérites et colluvions<br />';
      div.innerHTML += '<i style="background:#FABF51"></i>Dépôts superficiels et sables<br />';
      div.innerHTML += '<i style="background:#D5BAD7"></i>Calcaires du Tertiaire<br />';
      div.innerHTML += '<i style="background:#86608E"></i>Molasses du Tertiaire<br />';
      div.innerHTML += '<i style="background:#89C17A"></i>Calcaires du Crétacé<br />';
      div.innerHTML += '<i style="background:#4B97CD"></i>Calcaires du Jurassique<br />';
      div.innerHTML += '<i style="background:#C17F92"></i>Roches sédimentaires du Primaire<br />';
      div.innerHTML += '<i style="background:#F19EB7"></i>Roches métamorphiques du Primaire<br />';
      div.innerHTML += '<i style="background:#DE6EA1"></i>Roches granitiques du Primaire<br />';
    } else if (category == 'urbanisme') {
      div.innerHTML += '<h4>Légende</h4>';
      div.innerHTML += '<i style="background:#E30613"></i>Zone urbaine<br />';
      div.innerHTML += '<i style="background:#927CB8"></i>Zone activité et loisir<br />';
      div.innerHTML += '<i style="background:#F18700"></i>Zone à aménager<br />';
      div.innerHTML += '<i style="background:#FFED00"></i>Zone diffuse<br />';
    }

    return div;
  };

  legend.addTo(map);
}

CaueViews.pointToLayer = function(featureData, latlng) {
  // Use SVG Markers instead of Leaflet standard ones to allow theming
  // Standard radius is 10, let's use a smaller one
  return L.circleMarker(latlng, {radius: 5});
};

CaueViews.displayHomePage = function() {
  // Init map
  CaueViews.initMap();
  // Create base map
  map.setView([45.10, 1.57], 9);
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
      this._div.innerHTML = 'Survolez une communauté de communes';
    }
  };

  info.addTo(map);
  function highlightFeature(e) {
    var layer = e.target;
    info.update(layer.feature.properties);
    layer.setStyle({
      weight: 3,
      fillOpacity: 0.7,
    });

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }
  }
  function resetHighlight(e) {
    info.update();
    var layer = e.target;
    layer.setStyle({
      weight: 1,
      fillOpacity: 0.2,
    });

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToBack();
    }
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
  // GeoJSON data layer
  function style(feature) {
    return {
      color: 'black',
      opacity: 1,
      weight: 1,
      fillColor: 'white',
      fillOpacity: 0.2,
    };
  }
  $.ajax({
    type: "GET",
    url: "data/geojson/home.geojson",
    dataType: 'json',
    success: function (response) {
      var geojsonLayer = L.geoJson(response, {style: style, onEachFeature: onEachFeature}).addTo(map);
      // map.fitBounds(geojsonLayer.getBounds());
    }
  });
};

CaueViews.displayMapPage = function(community, category) {
  // Init map
  CaueViews.initMap(category);
  map.setView([45, 0.67], 10);
  map.setMaxBounds([[44,-0.2],[46,1.7]], {animate: true});
  // Add Base Layer
  var caueUrl = 'http://82.196.6.196/CAUE24_' + category + '/{z}/{x}/{y}.png';
  // Temporary hack, will be removed before production
  if (category == 'geographie') {
    caueUrl = 'http://82.196.6.196/CAUE24_9_geographie/{z}/{x}/{y}.png';
  }
  var caueAttrib = 'Données cartographiques fournies par le <a href="http://www.cauedordogne.com" target="_blank">CAUE24</a>';
  L.tileLayer(caueUrl, {minZoom: 9, maxZoom: 15, attribution: caueAttrib}).addTo(map);
  // Add GeoJSON Layer
  function onEachFeature(feature, layer) {
    if (feature.properties) {
      var properties = feature.properties;
      layer.on('click', function(e) {
        CaueViews.clickLayer(e.target, properties.ALTITUDE);
      });
    }
  }
  $.ajax({
    type: "GET",
    url: "data/geojson/" + community + "_" + category + ".geojson",
    dataType: 'json',
    success: function (response) {
      var geojsonLayer = L.geoJson(response, {pointToLayer: CaueViews.pointToLayer, onEachFeature: onEachFeature}).addTo(map);
      L.control.layers(null, {"Villes": geojsonLayer}).addTo(map);
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
    //url: "data/" + featureId + ".html",
    url: "data/test-page.html",
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
      $('.nav li').removeClass('active');
      $('.nav li').each(function () {
        $('a', this).attr('href', '#' + community + '/' + $(this).attr('class'));
      });
      // Change active category
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
      // Display map
      CaueViews.displayMapPage(community, myCategory);
      // Nothing else to do
    }
  });

  var app = new CaueApp();
  Backbone.history.start();

})(Backbone,  _, jQuery);
