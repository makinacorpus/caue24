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
  if (category == 'geographie' || category == 'urbanisme') {
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

CaueViews.addGeoJSONLegend = function(layers, category, data, n) {
  // Layer name
  var name = data.name || 'Sans nom';
  // Layer color
  var color = data.color || CaueViews.getColorFromFeature(category, n);
  // Initial layer status
  var active = data.active || "false";
  // Layer text information property
  var displayText = data.displayText;
  var style = {
    "color": color,
    "weight": 1,
  };
  // Add the geojson layer to the map
  var geojsonLayer = L.geoJson(data, {pointToLayer: CaueViews.pointToLayer, onEachFeature: CaueViews.onEachFeature, style: style});
  if (active == "true") {
    geojsonLayer.addTo(map);
  }
  // Add it to the layer switcher
  layers.addOverlay(geojsonLayer, name);
  // Should we adjust the bounds of the map ?
  // map.fitBounds(geojsonLayer.getBounds());
}

CaueViews.addInitTexts = function(community, category) {
  $.ajax({
    url: "data/territoires/" + community + "_" + category + ".html",
  }).done(function(data) {
    var dom$ = $(data);
    // Parse and display data
    $('#map-modal').html('');
    $.each(dom$.find('h2').first().nextUntil('h2'), function () {
      $('#map-modal').append($(this)[0].outerHTML);
    });
    // $('#map-modal').show();
    $('#map-infos').html('');
    $.each(dom$.find('h2').nextAll('h2').first().nextUntil('h2'), function () {
      $('#map-infos').append($(this)[0].outerHTML);
    });
    $('#map-photos').html('');
    $.each(dom$.find('h2').last().nextAll(), function () {
      $('#map-photos').append($(this)[0].outerHTML);
    });
  }).fail(function(jqXHR, textStatus, errorThrown) {
    $('#map-infos').html("Créez un contenu pour cet élement en allant sur <a href='http://prose.io/#makinacorpus/caue24/new/gh-pages/data/territoires/" + community + "_" + category + ".md'>cette page</a>.");
    $('#map-photos').html('');
    $('#map-modal').html('');
  });
}

CaueViews.addGeoJSONs = function(community, category) {
  // Initiate the layer switcher
  var layers = L.control.layers(null, null, {collapsed: false});
  // Add WMS
  var photo = L.tileLayer.wms("http://ids.pigma.org/geoserver/wms", {
    layers: 'ign_r:BDOrtho40cm_2009_aqui_blanc_transparent',
    format: 'image/png',
    transparent: true,
    attribution: "Données cartographiques fournies par le CAUE24"
  });
  layers.addOverlay(photo, "photo");
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
      }
      // Handle geojson
      CaueViews.addGeoJSONLegend(layers, category, data, n);
      // Eventually load next one
      if (n < 6) {
        loadUrl(baseUrl, n + 1);
      }
    }).fail(function(jqXHR, textStatus, errorThrown) {
      // Nothing to do, the loop will just stop
    });
  }

  var url = "data/geojson/" + community + "_" + category;
  loadUrl(url, 1);
}

CaueViews.onEachFeature = function (feature, layer) {
    if (feature.properties) {
      var properties = feature.properties;
      layer.on('click', function(e) {
        CaueViews.clickLayer(e.target, properties.ALTITUDE);
      });
    }
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
  var caueUrl = 'http://{s}.livembtiles.makina-corpus.net/caue24/CAUE/{z}/{x}/{y}.png';
  var caueAttrib = 'Données cartographiques fournies par le <a href="http://www.cauedordogne.com" target="_blank">CAUE24</a>';
  L.tileLayer(caueUrl, {minZoom: 8, maxZoom: 11, attribution: caueAttrib, subDomains: 'abcdefgh'}).addTo(map);

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
  map.fitBounds(map.getBounds(), {paddingTopLeft:[0, 40], paddingBottomRight:[0, 130]});
  map.name = 'map';
  // Add Base Layer
  var caueUrl = 'http://{s}.livembtiles.makina-corpus.net/caue24/CAUE24_' + category + '/{z}/{x}/{y}.png';
  var caueAttrib = 'Données cartographiques fournies par le <a href="http://www.cauedordogne.com" target="_blank">CAUE24</a>';
  L.tileLayer(caueUrl, {minZoom: 9, maxZoom: 15, attribution: caueAttrib, subdomains: 'abcdefgh'}).addTo(map);
  // Add Content
  CaueViews.addInitTexts(community, category);
  // Add GeoJSON Layers
  CaueViews.addGeoJSONs(community, category);
};

CaueViews.displayData = function(layer, rawHtml, id) {
  var dom$ = $(rawHtml);
  // Parse data
  var popupTitle = dom$.find('#titre_de_la_popup').nextUntil('h2').html();
  var popupContent = dom$.find('#contenu_de_la_popup').nextUntil('h2').html();
  var additionalText = dom$.find('#contenu_additionnel_de_gauche').nextUntil('h2').html();
  var photos = dom$.find('#contenu_additionnel_de_droite').nextUntil('h2').html();
  // Raise events
  layer.bindPopup('<h2>'+ popupTitle +'</h2>' + popupContent).openPopup();
  $('#map-infos').html(additionalText);
  $('#map-photos').html(photos);
};

CaueViews.clickLayer = function(layer, id) {
  // Get id Jekyll page
  var layerHash = L.Util.hash(layer),
      featureId = layerHash.substring(0, 6);
  // Get page content
  $.ajax({
    url: "data/features/" + featureId + ".html",
  }).done(function(data) {
      CaueViews.displayData(layer, data, id);
  }).fail(function(jqXHR, textStatus, errorThrown) {
    $('#map-infos').html("Créez un contenu pour cet élement en allant sur <a href='http://prose.io/#makinacorpus/caue24/new/gh-pages/data/features/" + featureId + ".md'>cette page</a>.");
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
      // Set category class on body field so everything is correctly themed
      $('body').removeClass().addClass(myCategory);
      // Display map
      CaueViews.displayMapPage(community, myCategory);
      // Nothing else to do
    }
  });

  var app = new CaueApp();
  Backbone.history.start();

})(Backbone,  _, jQuery);
