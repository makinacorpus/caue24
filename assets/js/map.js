var map = new L.Map('map').setView([45, 0.67], 10);
var mapquestUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
var subDomains = ['otile1','otile2','otile3','otile4'];
var mapquestAttrib = 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors';
L.tileLayer(mapquestUrl, {maxZoom: 15, attribution: mapquestAttrib, subdomains: subDomains}).addTo(map);
