var map = L.map('map').setView([-29.50, 145], 4);

var tab = [[L.marker([-27.46, 153.0280900],{title:'Brisbane'}),L.marker([-28.00, 153.4308800],{title:'Gold Coast'}),L.marker([-19.26, 146.80],{title:'Townsville'}),L.marker([-16.92, 145.76],{title:'Cairns'})]];
var names = [['Brisbane','Gold Coast','Townsville','Cairns']];

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    var layer = e.target;

    /*for (let i = 0; i < tab[layer.feature.properties.code].length; i++){
        tab[layer.feature.properties.code][i].unbindTooltip();
        map.removeLayer(tab[layer.feature.properties.code][i]);
    }*/
    info.update();
}

function zoomToFeature(e) {
    //map.fitBounds(e.target.getBounds()); //TO ZOOM
    //marker = L.marker([-27.46, 153.0280900],{title:'Brisbane'}).addTo(map).bindTooltip("Brisbane", {permanent: true, direction: ''});
    var layer = e.target;

    //Faudrait prendre tous les layers sauf la variable layer 

    map.eachLayer(function(lay) {if( lay == layer ) console.log("hello")});

    for (let i = 0; i < tab[layer.feature.properties.code].length; i++){
        tab[layer.feature.properties.code][i].unbindTooltip();
        map.removeLayer(tab[layer.feature.properties.code][i]);
    }

    for (let i = 0; i < tab[layer.feature.properties.code].length; i++){
        tab[layer.feature.properties.code][i].addTo(map).bindTooltip(names[layer.feature.properties.code][i], {permanent: true, direction: 'right'});
    }

    layer.setStyle({
        fillColor: 'white',
        weight: 2,
        opacity: 1,
        color: 'black',
        dashArray: '5',
        fillOpacity: 0
    });
    //console.log(e.target.getBounds().getSouthWest().lat);
    
    //L.marker([e.target.getBounds().getSouthWest().lng, e.target.getBounds().getSouthWest().lat],zIndexOffset=100).addTo(map);
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var geojson;

geojson= L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);



var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
        : 'Hover over a state');
};

info.addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

//geojson = L.geoJson(statesData, {style: style}).addTo(map);

