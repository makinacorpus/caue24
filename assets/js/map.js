// Create base map
var map = new L.Map('map').setView([45, 0.67], 10);
map.attributionControl.setPrefix('Par <a href="http://makina-corpus.com">Makina Corpus</a>');
// Add Base Layer
var caueUrl = 'http://82.196.6.196/CAUE24/{z}/{x}/{y}.png';
var caueAttrib = 'Données cartographiques fournies par le <a href="http://www.cauedordogne.com" target="_blank">CAUE24</a>';
L.tileLayer(caueUrl, {maxZoom: 15, attribution: caueAttrib}).addTo(map);
// Add GeoJSON Layer
var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML = (props ? '<b>' + props.COMMUNAUT + '</b>' : 'Survolez une communauté de commune');
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
      // location.hash = properties.COMMUNAUT;
    }, 
  });
}
function pointToLayer(featureData, latlng) {
  return L.circleMarker(latlng);
}
$.ajax({
  type: "GET",
//  url: "http://localhost:4000/assets/cdc.geojson",
  url: "http://makinacorpus.github.io/caue24/assets/cdc.geojson",
  dataType: 'json',
  success: function (response) {
    geojsonLayer = L.geoJson(response, {onEachFeature: onEachFeature, pointToLayer: pointToLayer}).addTo(map);
    map.fitBounds(geojsonLayer.getBounds());
  }
});
