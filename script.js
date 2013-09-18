(function (Backbone, _, $, undefined) {
"use strict";

Backbone.$ = $;

window.Caue = window.Caue || {};


Caue.Map = Backbone.Model.extend({
});


Caue.MapList = Backbone.Collection.extend({
    model: Caue.Map,

    initialize: function (catalog) {
        this.catalog = catalog;
    },

    url: function () {
        return 'http://82.196.6.196/' + this.catalog + '.json';
    },

    parse: function (response) {
        return response.maps;
    },
});



Caue.HomeView = Backbone.View.extend({
    render: function () {
        this.$el.html('hey');
        return this;
    }
});


Caue.DetailView = Backbone.View.extend({

    render: function () {
        this.$el.html(this.options.name);
        return this;
    }
});


var CaueApp = Backbone.Router.extend({

    routes: {
        "":                  "home",
        ":name":             "detail"
    },

    home: function() {
        $("#content").html((new Caue.HomeView()).render().el);
    },

    detail: function(mapname) {
        $("#content").html((new Caue.DetailView({name:mapname})).render().el);
    },
});

var app = new CaueApp();
Backbone.history.start();


})(Backbone,  _, jQuery);