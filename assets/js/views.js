var CaueViews = {};

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
}

CaueViews.clickLayer = function(layer, id) {
  // Get id Jekyll page
  var featureId = id;
  // Get page content
//  var page = $.get("http://localhost:4000/data/test-page.html", function(data) {
  var page = $.get("http://makinacorpus.github.io/caue24/data/test-page.html", function(data) {
    // And parse it
    CaueViews.displayData(layer, data, id);
  });
}
