// Need of running the "py -m http.server 8000" to work

/**
 * A function that give an appropriate color to represent the number of city of the dataset in a region.
 *
 * @param {number} n - The number of city in a region for which we want the color
 * @returns {string} The color, if the number of city is close to 40 it will be darker blue, else lighter blue. If the number is 0 the color is white.
 */
function getColor(n) {
    if (n === 0) {
        return '#F0F0F0';
    } else {
        const baseColor = chroma('blue').saturate(0.8).brighten(1);
        // Calculer la saturation en fonction du nombre de villes
        const saturation = Math.min(n / 40, 1);
        // Créer une couleur plus foncée en utilisant la fonction darken de chroma.js
        return baseColor.darken(saturation * 2);
    }
}

function updateDataInfo(e){
    document.getElementById('data-info').innerText = e;
}


document.addEventListener("DOMContentLoaded", function () {
    /**
     * Open and manipulate the csv file
     */
    d3.csv("../static/data/coordCities.csv").then(function (data) {
        // Create Leaflet map
        var map = L.map('map').setView([-25, 135], 4);


        // Add tile layer to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
        }).addTo(map);

        var cities = [];

        //var populationTotale = 0;
        data.forEach(function (d) {
            cities.push({
                id: parseInt(d.id),
                name: d.city,
                lat: parseInt(d.lat),
                lng: parseInt(d.long),
            });
            //populationTotale += parseInt(d.population);
        });
        var geoJSONLayer;
        $.getJSON("../static/geoJSON/local-government-area.geojson", function (data) {

            var regions = {};
            var regionsColor = {};
            for (var i = 0; i < data.features.length; i++) {
                regions[i] = [];
                regionsColor[i] = 0;
                var lga = data.features[i];
                for (var j = 0; j < cities.length; j++) {
                    var city = cities[j];
                    var point = turf.point([city.lng, city.lat]);
                    if (turf.booleanPointInPolygon(point, lga)) {
                        regions[i].push(city);
                        regionsColor[i]++;
                    }
                }
            }
            
            // Parcourir à nouveau le GeoJSON et ajouter chaque région à la carte en lui attribuant une couleur 
            for (var i = 0; i < data.features.length; i++) {
                var lga = data.features[i];
                var fillColor = getColor(regionsColor[i])
                geoJSONLayer = L.geoJSON(lga, {
                    style: {
                        fillColor: fillColor,
                        fillOpacity: 0.8,
                        weight: 2,
                        color: 'white'
                    }
                }).addTo(map).eachLayer(function(layer){
                    layer.on('click', function(){
                        var regionId = layer.feature    ;
                        console.log(regionId)
                        var regionName = layer.feature.properties.lga_name_long;
                        updateDataInfo(regionName)
                    });
                })
            }
        });
    });
});