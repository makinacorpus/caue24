(function (Backbone, _, $, undefined) {
"use strict";

Backbone.$ = $;

window.Caue = window.Caue || {};

Caue.MAP_SERVER = 'http://82.196.6.196:49191/';


Caue.Map = Backbone.Model.extend({
    url: function () {
        return Caue.MAP_SERVER + this.get('catalog') + '/' + this.get('name') + '.json';
    },
});


Caue.MapList = Backbone.Collection.extend({
    model: Caue.Map,

    initialize: function (catalog) {
        this.catalog = catalog;
    },

    url: function () {
        return Caue.MAP_SERVER + this.catalog + '.json';
    },

    parse: function (response) {
        return response.maps;
    },
});



Caue.HomeView = Backbone.View.extend({
    template: Mustache.compile('<h1>Liste des cartes {{ catalog }}</h1>' +
                               '<div id="maplist"><ul></ul></div>'),

    templateItem: Mustache.compile('<li><a href="#{{ id }}">{{ name }}<img src="{{ preview }}"/></a></li>'),

    initialize: function () {
        this.maplist = new Caue.MapList(this.options.catalog);
        this.maplist.bind('add', this.addOne, this);
        this.maplist.fetch();
    },

    render: function () {
        this.$el.html(this.template({catalog: this.options.catalog}));
        return this;
    },

    addOne: function (item) {
        this.$('ul').prepend(this.templateItem(item.attributes));
    }
});


Caue.DetailView = Backbone.View.extend({
    template: Mustache.compile('<div id="map"></div>'),

    initialize: function () {
        this.mapdefinition = new Caue.Map({catalog: this.options.catalog,
                                           name: this.options.name});
        this.mapdefinition.bind('sync', this.initMap, this);
        this.mapdefinition.fetch();
    },

    render: function () {
        this.$el.html(this.template({name: this.options.name}));
        return this;
    },

    initMap: function () {
        var mapdiv = this.$("#map")[0];
        L.mapbox.map(mapdiv, this.mapdefinition.attributes);
    }
});


var CaueApp = Backbone.Router.extend({

    routes: {
        "":                  "home",
        ":name":             "detail"
    },

    catalog: 'makina',

    home: function() {
        var view = new Caue.HomeView({catalog: this.catalog});
        $("#menu").html(view.render().el);
    },

    detail: function(mapname) {
        var view = new Caue.DetailView({catalog: this.catalog,
                                        name: mapname});
        $("#content").html(view.render().el);
    },
});

var app = new CaueApp();
Backbone.history.start();


})(Backbone,  _, jQuery);