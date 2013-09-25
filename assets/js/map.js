// Create base map
var map = new L.Map('map').setView([45, 0.67], 10);
// Add OSM Layer
var mapquestUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
var subDomains = ['otile1','otile2','otile3','otile4'];
var mapquestAttrib = 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors';
L.tileLayer(mapquestUrl, {maxZoom: 15, attribution: mapquestAttrib, subdomains: subDomains}).addTo(map);
// Add GeoJSON Layer
function onEachFeature(feature, layer) {
  if (feature.properties) {
    layer.bindPopup("Altitude : " + feature.properties.ALTITUDE);
  }
}
$.ajax({
  type: "GET",
//  url: "http://localhost:4000/assets/test.geojson",
  url: "http://makinacorpus.github.io/caue24/assets/test.geojson",
  dataType: 'json',
  success: function (response) {
    geojsonLayer = L.geoJson(response, {onEachFeature: onEachFeature}).addTo(map);
  }
});
