var CaueViews = {};

CaueViews.clickLayer = function(layer, id) {
  // Get id Jekyll page
  // Parse it
  // Raise events
  layer.bindPopup("Altitude : " + id);
  $('#map-infos').html("Infos additionnelles " + id);
  $('#map-photos').html("Photos " + id);
}
