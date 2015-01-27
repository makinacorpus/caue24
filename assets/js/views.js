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
  // Scale
  L.control.scale({imperial: false}).addTo(map);
}

CaueViews.addLegend = function(category) {
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    if (category == 'geographie') {
      div.innerHTML += '<div tabindex="0" data-placement="left" data-toggle="tooltip" type="button" data-original-title="Sédiments déposés en fond de vallée par les cours d’eau et composés de limons et d\'argile parfois mêlés à des éléments plus grossiers (sables, graviers, galets)"><i style="background:#EAE2E1"></i>Alluvions</div>';
      div.innerHTML += '<div tabindex="0" data-placement="left" data-toggle="tooltip" type="button" data-original-title="Replats situés en vallée ou en versant (dépôts fluviatiles d’argiles, sables, graviers, galets), restes des anciens lits du cours d’eau qui s’est enfoncé"><i style="background:#C2B6B3"></i>Terrasses alluviales</div>';
      div.innerHTML += '<div tabindex="0" data-placement="left" data-toggle="tooltip" type="button" data-original-title="Formations de recouvrement argilo-sableuses provenant de l’altération des roches sous-jacentes avec présence de débris de calcaires remaniés, silex et concrétions ferrugineuses"><i style="background:#FFE595"></i>Altérites et colluvions</div>';
      div.innerHTML += '<div tabindex="0" data-placement="left" data-toggle="tooltip" type="button" data-original-title="Formations meubles composées d’argiles, sables, graviers et galets, issus de dépôts détritiques fluviatiles du tertiaire"><i style="background:#FABF51"></i>Dépôts superficiels et sables</div>';
      div.innerHTML += '<div tabindex="0" data-placement="left" data-toggle="tooltip" type="button" data-original-title="Calcaires d’origine lacustre généralement durs"><i style="background:#D5BAD7"></i>Calcaires du tertiaire</div>';
      div.innerHTML += '<div tabindex="0" data-placement="left" data-toggle="tooltip" type="button" data-original-title="Formations sédimentaires meubles sablo-argileuses souvent carbonatées"><i style="background:#86608E"></i>Molasses du tertiaire</div>';
      div.innerHTML += '<div tabindex="0" data-placement="left" data-toggle="tooltip" type="button" data-original-title="Calcaires hétérogènes du crétacé durs à tendres parfois gréseux, marneux ou crayeux formés durant la transgression marine au crétacé"><i style="background:#89C17A"></i>Calcaires du crétacé</div>';
      div.innerHTML += '<div tabindex="0" data-placement="left" data-toggle="tooltip" type="button" data-original-title="Calcaires généralement durs à très durs parfois marneux et gréseux (calcaires du Lias) formés durant l’occupation marine du jurassique"><i style="background:#4B97CD"></i>Calcaires du jurassique</div>';
      div.innerHTML += '<div tabindex="0" data-placement="left" data-toggle="tooltip" type="button" data-original-title="Formations géologiques composées pour l’essentiel de grès"><i style="background:#C17F92"></i>Roches sédimentaires du primaire</div>';
      div.innerHTML += '<div tabindex="0" data-placement="left" data-toggle="tooltip" type="button" data-original-title="Formations diversifiées de gneiss dominants, schistes, micaschistes et roches diverses"><i style="background:#F19EB7"></i>Roches métamorphiques du primaire</div>';
      div.innerHTML += '<div tabindex="0" data-placement="left" data-toggle="tooltip" type="button" data-original-title="Formations composées pour l’essentiel de granit (roches grenues très dures), dont l’altération conduit à la formation d’arènes granitiques"><i style="background:#DE6EA1"></i>Roches granitiques du primaire</div>';
    }

    return div;
  };

  legend.addTo(map);

  // Add Tooltips
  $('.info.legend div').tooltip({container:'body'});
}

CaueViews.getColorFromFeature = function(category, n) {
  if (n == 1) {
    switch(category) {
      // See ../less/theme.less for according colors
      case 'portrait': return '#ef5259';
      case 'geographie': return '#2db877';
      case 'histoire': return '#f1b847';
      case 'urbanisme': return '#a7d028';
      case 'architecture': return '#2dcfd5';
      case 'atouts': return '#7c4bb4';
    }
  }
  // use default for now
  return '#03f';
}

CaueViews.addGeoJSONLegend = function(layers, community, category, data, n) {
  // Layer name
  var name = data.name || 'Sans nom';
  // Layer description
  var description = data.description || '';
  // Layer color
  var color = data.color || CaueViews.getColorFromFeature(category, n);
  // Initial layer status
  var active = data.active || "false";
  // Is the layer interactive
  var interactive = data.interactive || "true";
  // Layer text information property
  var displayText = data.displayText;

  onEachFeature = function (feature, layer) {
    if (interactive != "false") {
      layer.on('click', function(e) {
        CaueViews.clickLayer(e.target, community, category);
      });
    }
  }

  style = function (feature, layer) {
    var style = {
      "color": color,
      "weight": 1,
      "fillOpacity": 0.4,
      "opacity": 0.8,
      "clickable": true,
    };
    if (interactive == "false") {
      style.clickable = false;
    };
    if (category == 'portrait' || category == 'geographie' || category == 'architecture') {
      style.weight = 4;
    }
    return style;
  }

  // Add the geojson layer to the map
  var geojsonLayer = L.geoJson(data, {pointToLayer: CaueViews.pointToLayer, onEachFeature: onEachFeature, style: style});
  if (active == "true") {
    geojsonLayer.addTo(map);
    if (category == 'geographie') {
      geojsonLayer.bringToFront();
    } else {
      geojsonLayer.bringToBack();
    }
  }
  // Add it to the layer switcher
  layers.addOverlay(geojsonLayer, name);
  // Add it to the legend
  $('.info.legend').append('<div tabindex="0" data-placement="left" data-toggle="tooltip" type="button" data-original-title="' + description + '"><i style="background:' + color + '"></i>' + name + '</div>');

  // Add Tooltips
  $('.info.legend div').tooltip({container:'body'});
}

CaueViews.addInitTexts = function(community, category) {
  $.ajax({
    url: "data/territoires/" + community + "_" + category + ".html",
  }).done(function(data) {
    var dom$ = $(data);
    // Parse and display data
    var popup = '';
    $.each(dom$.find('h2').first().nextUntil('h2'), function () {
      popup += $(this)[0].outerHTML;
    });
    if (popup != '') {
      $('#map-modal .content').html('').append(popup).parent().addClass('open');
      // $.magnificPopup.open({
      //   items: {
      //     src: '<div id="map-modal">' + popup + '</div>', // can be a HTML string, jQuery object, or CSS selector
      //     type: 'inline'
      //   }
      // });
    } else {
      $('#map-modal .content').removeClass('open');
    }

    $('#map-infos').html('');
    $.each(dom$.find('h2').nextAll('h2').first().nextUntil('h2'), function () {
      $('#map-infos').append($(this)[0].outerHTML);
    });

    $('#map-savoir-plus').html('');
    $.each(dom$.find('h2').nextAll('h2').nextAll('h2').first().nextUntil('h2'), function () {
      $('#map-savoir-plus').append($(this)[0].outerHTML);
    });

    if ($('#map-savoir-plus').text().length != '') {
      $('#map-infos').append('<a id="more" href="#map-savoir-plus">&gt;&gt; En savoir plus</a>');
    };
    
    $('#map-photos .carousel-inner ul').html('');
    $.each(dom$.find('h2').last().nextAll(), function () {
      $(this).find('img').each(function(index) {
        var item = '<li class="item"><a class="gallery" href="'+$(this).attr('src')+'">'+$(this)[0].outerHTML+'</a></li>';
        $('#map-photos ul').append(item);
      });
    });

    // Set category class on body field so everything is correctly themed
    $('body').removeClass().addClass(category);
  }).fail(function(jqXHR, textStatus, errorThrown) {
    $('#map-infos').html("Créez un contenu pour cet élement en allant sur <a href='http://prose.io/#makinacorpus/caue24/new/gh-pages/data/territoires/" + community + "_" + category + ".md'>cette page</a>.");
    $('#map-photos .carousel-inner ul').html('');
  });
}

CaueViews.addGeoJSONs = function(community, category) {
  // Add Mask
  $.ajax({
    url: "data/geojson/" + community + "_mask.geojson",
    dataType: 'json',
  }).done(function(data) {
    var style = {
      color: 'black',
      opacity: 1,
      weight: 3,
      fillColor: 'white',
      fillOpacity: 0.6,
      clickable: false,
    };
    // Add the geojson layer to the map
    L.geoJson(data, {style: style}).addTo(map);
  }).fail(function(jqXHR, textStatus, errorThrown) {
    // Nothing to do, there simply will be no overlay
  });
  // Add CdC highlight
  $.ajax({
    url: "data/geojson/" + community + ".geojson",
    dataType: 'json',
  }).done(function(data) {
    // Add the geojson layer to the map
    var overlay = L.geoJson(data);
    // Adjust the bounds of the map to this geojson
    map.fitBounds(overlay.getBounds());
  }).fail(function(jqXHR, textStatus, errorThrown) {
    // Nothing to do, there simply will be no overlay
  });
  // Initiate the layer switcher
  var layers = L.control.layers(null, null, {collapsed: false});
  // Bruteforce method...
  function loadUrl(baseUrl, n) {
    // Get GeoJSON(s) from directory
    $.ajax({
      url: baseUrl + "_" + n + ".geojson",
      dataType: 'json',
    }).done(function(data) {
      if (n == 1) {
        // There is at least 1 geojson => add the layer switcher to the map
        layers.addTo(map);
        // Add the Legend too
        if (category != 'geographie') {
          CaueViews.addLegend(category);
        }
      }
      // Handle geojson
      CaueViews.addGeoJSONLegend(layers, community, category, data, n);
      // Eventually load next one
      loadUrl(baseUrl, n + 1);
    }).fail(function(jqXHR, textStatus, errorThrown) {
      // Nothing to do, the loop will just stop
    });
  }

  var url = "data/geojson/" + community + "_" + category;
  loadUrl(url, 1);
}

CaueViews.pointToLayer = function(featureData, latlng) {
  // Use SVG Markers instead of Leaflet standard ones to allow theming
  // Standard radius is 10, let's use a smaller one
  return L.circleMarker(latlng, {radius: 5});
};

// Function that we will use to update the control based on feature properties passed
CaueViews.updateInfo = function (props) {
  if (props) {
    var cdc = props.TYPOLOGIE2.toFixed();
    var realCdc = $('.dropdown-menu li:nth-child('+cdc+') a').text();
    $('button.dropdown-toggle:first').text(realCdc);
  } else {
    $('button.dropdown-toggle:first').text('Choisissez un territoire');
  }
};

CaueViews.displayHomePage = function() {
  // Init map
  CaueViews.initMap();
  // Create base map
  map.setView([45.10, 1.57], 9);
  map.name = "home";
  // Add Base Layer
  var caueUrl = 'http://{s}.tilestream.makina-corpus.net/v2/caue24-_-CAUE/{z}/{x}/{y}.png';
  var caueAttrib = 'Données cartographiques fournies par le <a href="http://www.cauedordogne.com" target="_blank">CAUE24</a>';
  L.tileLayer(caueUrl, {minZoom: 8, maxZoom: 11, attribution: caueAttrib, subDomains: 'abcd'}).addTo(map);

  // Add GeoJSON Layer
  function highlightFeature(e) {
    var layer = e.target;
    CaueViews.updateInfo(layer.feature.properties);
    layer.setStyle({
      weight: 3,
      fillOpacity: 0.7,
    });

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }
  }
  function resetHighlight(e) {
    CaueViews.updateInfo();
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
      fillOpacity: 0.5,
    };
  }
  $.ajax({
    type: "GET",
    url: "data/geojson/home.geojson",
    dataType: 'json',
    success: function (response) {
      var geojsonLayer = L.geoJson(response, {style: style, onEachFeature: onEachFeature}).addTo(map);
    }
  });
};

CaueViews.displayMapPage = function(community, category) {
  // Init map
  CaueViews.initMap(category);
  map.setView([45, 0.67], 11);
  // map.fitBounds(map.getBounds(), {paddingTopLeft:[0, 40], paddingBottomRight:[0, 130]});
  map.name = 'map';
  // Add Base Layer
  var caueUrl = 'http://{s}.tilestream.makina-corpus.net/v2/caue24-_-CAUE24_' + category + '/{z}/{x}/{y}.png';
  var caueAttrib = 'Données cartographiques fournies par le <a href="http://www.cauedordogne.com" target="_blank">CAUE24</a>';
  // L.tileLayer(caueUrl, {minZoom: 11, maxZoom: 15, attribution: caueAttrib, subdomains: 'abcd'}).addTo(map);
  // Add WMS
  /*
  var photo = L.tileLayer.wms("http://ids.pigma.org/geoserver/wms", {
    layers: 'ign_r:BDOrtho40cm_2009_aqui_blanc_transparent',
    format: 'image/png',
    transparent: true,
    attribution: "Données cartographiques fournies par le CAUE24"
  });
  */
  // Use TileLayer.Multi plugin
  L.TileLayer.multi({
    14: {
      url: caueUrl,
      subdomains: 'abcd'
    },
    15: {
      url: 'http://{s}.tilestream.makina-corpus.net/v2/caue24-_-orthophoto24/{z}/{x}/{y}.png',
      subdomains: 'abcd'
    }
  }, {
    minZoom: 10,
    maxZoom: 15,
    attribution: caueAttrib
  }).addTo(map);
  // Add Content
  CaueViews.addInitTexts(community, category);
  if (category == 'geographie') {
    CaueViews.addLegend(category);
  }
  // Add GeoJSON Layers
  CaueViews.addGeoJSONs(community, category);
};

CaueViews.displayData = function(layer, rawHtml) {
  var dom$ = $(rawHtml);
  // Parse data
  var popup = L.popup({autoPanPadding:[0,60]});
  $.each(dom$, function() {
    popup = popup.setContent($(this)[0].outerHTML);
  });
  // Open popup
  layer.bindPopup(popup).openPopup();

  $(popup._wrapper).find('img').each(function () {
    $(this).load(function () {
      popup._update();
    });
  });
};

CaueViews.clickLayer = function(layer, community, category) {
  // Get id Jekyll page
  var layerHash = L.Util.hash(layer),
      featureId = layerHash.substring(0, 6);
  // Get page content
  $.ajax({
    url: "data/features/" + community + "/" + category + "/" + featureId + ".html",
    // url: "data/test-page.html",
  }).done(function(data) {
      CaueViews.displayData(layer, data);
  }).fail(function(jqXHR, textStatus, errorThrown) {
    layer.bindPopup("Créez un contenu pour cet élement en allant sur <a href='http://prose.io/#makinacorpus/caue24/new/gh-pages/data/features/" + community + "/" + category + "/" + featureId + ".md'>cette page</a>.", {autoPanPadding:[0,50]}).openPopup();
  });
};

(function (Backbone, _, $, undefined) {
  "use strict";

  Backbone.$ = $;

  var CaueApp = Backbone.Router.extend({

    routes: {
        "":                         "home",
        "menu":                     "menu",
        ":communaute(/:category)":  "map"
    },

    home: function() {
      $('body').attr('data-state', 'home');
      // Display map
      CaueViews.displayHomePage();
      // Nothing else to do
    },

    menu: function() {
      $('body').attr('data-state', 'menu');

      // If map already exist, don't reload it, just center it.
      if (map instanceof L.Map && map.name == "home") {
        map.panTo([45.10, 0.67], {duration: 1});
      } else {
        CaueViews.displayHomePage();
        map.panTo([45.10, 0.67], {animate: false});
      }
    },

    map: function(community, category) {
      // If coming on another page than a map page
      if ($('body').attr('data-state') != 'map') {
        // Define page state to map, launching transition 
        $('body').attr({'data-state':'map', 'data-transition':'transition'});

        $('#map-photos').one(transitionEnd, function() {
          // Animation finished, remove transition state
          $('body').attr('data-transition','');

          // Init lightbox on gallery carousel
          $('.carousel-inner ul').magnificPopup({
            delegate: 'li .gallery',
            type: 'image',
            mainClass: 'mfp-with-zoom',
            gallery: {
              enabled: true,
              navigateByImgClick: true
            },
            image: {
              verticalFit: true,
              titleSrc: function(item) {
                return item.el.find('img').attr('alt');
              }
            },
            zoom: {
              enabled: true,
              opener: function(element) {
                return element.find('img');
              }
            }
          });

          // Init lightbox on popup images
          $('body').on('click', '.leaflet-popup-content-wrapper img', function() {
            var _this = this;
            
            $.magnificPopup.open({
              items: {
                src: $(_this).attr('src')
              },
              type: 'image',
              mainClass: 'mfp-with-zoom',
              image: {
                verticalFit: true
              }
            });
          });

          $('#map-infos').magnificPopup({
            delegate: '#more',
            type: 'inline',
            overflowY: 'auto',
            mainClass: 'mfp-with-zoom'
          });
        });
      }

      // Get community label
      var myCommunity = $('.dropdown-menu').find('a[href="#'+community+'"]').text();
      // Set it as button label
      $('button.dropdown-toggle:first').text(myCommunity);
      // Eventually use default category if not present
      var myCategory = category;
      if (myCategory === null) {
        myCategory = 'portrait';
        this.navigate(community + '/' + myCategory, {replace: true});
      }
      // Update links so they point to the right community
      $('.nav li').removeClass('active');
      $('.nav li').each(function () {
        $('a', this).attr('href', '#' + community + '/' + $(this).attr('class'));
      });
      // Change active category
      $('.nav li.' + myCategory).addClass('active');
      // Display map
      CaueViews.displayMapPage(community, myCategory);
      // Event handler on map-modal close button
      $('#map-modal .close').on('click', function(){
        $('#map-modal').removeClass('open');
      });
      // Nothing else to do
    }
  });

  var app = new CaueApp();
  Backbone.history.start();

})(Backbone,  _, jQuery);
