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
};

CaueViews.displayError = function(featureId) {
  $('#map-photos').html("Créez un contenu pour cet élement en allant sur <a href='http://prose.io/#makinacorpus/caue24/new/gh-pages/data/" + featureId + ".md'>cette page</a>.");
}

CaueViews.clickLayer = function(layer, id) {
  // Get id Jekyll page
  var layerHash = L.Util.hash(layer),
      featureId = layerHash.substring(0, 6);
  // Get page content
  $.ajax({
//    url: "http://localhost:4000/data/" + featureId + ".html",
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
        ":communaute(/:category)":  "map"
    },

    map: function(communaute, category) {
      // Load correct map backgroud
      // Load associated GeoJSONs
      // Eventually use default category
      // Set category class on body field so everything is correctly themed
      // Nothing else to do
    }
});

var app = new CaueApp();
Backbone.history.start();

})(Backbone,  _, jQuery);
