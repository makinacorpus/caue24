L.Util.hash = function (layer, hashFunc) {
    hashFunc = hashFunc || (new Rusha()).digest;

    var latlngs = [];
    if (typeof layer.getLatLng == 'function') {
        latlngs = layer.getLatLng();
    }
    else if (typeof layer.getLatLngs == 'function') {
        latlngs = layer.getLatLngs();
    }

    var properties = '';
    if (layer.properties !== undefined) {
        properties = JSON.stringify(layer.properties);
    }

    var source = latlngs.toString() + properties.toString();
    return hashFunc(source);
};
