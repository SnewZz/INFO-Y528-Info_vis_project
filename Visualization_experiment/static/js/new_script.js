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

// Create Leaflet map
var map = L.map('map').setView([-25, 135], 4);


// Add tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
}).addTo(map);


const slider1 = document.getElementById("slider1");
const slider2 = document.getElementById("slider2");

const result1 = document.getElementById("result1");
const result2 = document.getElementById("result2");

slider1.addEventListener("change", async (event) => {

    if (event.target.value == 1) {

        d3.csv("../static/data/au.csv").then(function (data) {
            var filteredData = data.filter(function (d) { return d.population > 1000000; });
            var cities = filteredData.map(function (d) { return d.city; });
            // var jane = data.filter(function(d) { return d.city === 'Melbourne'; });
            var population = filteredData.map(function (d) { return d.population; });
            // var arr = Object.entries(cities)

            var barColors = "red";

            new Chart("chart", {
                type: "bar",
                data: {
                    labels: cities,
                    datasets: [{
                        backgroundColor: barColors,
                        data: population
                    }]
                },
                options: {
                    legend: { display: false },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                    }
                }
            });
            console.log(filteredData)

        })
    }

})

slider2.addEventListener("change", async (event) => {
    res.innerHTML = event.target.value;
})

slider2.addEventListener("change", async (event) => {
    //Every year, the color changes..
    if (event.target.value == 2011) {
        $.getJSON("../static/geoJSON/local-government-area.geojson", function (data) {
            var myLayer = L.geoJSON(data, {
                style: function (feature) {
                    return {
                        color: "red",
                        weight: 2,
                        fillOpacity: 0
                    };
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(`<b>${feature.properties.name}</b>`);
                }
            }).addTo(map);
        });
    }
})

d3.csv("../static/data/coordCities.csv").then(function (data) {

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
            L.geoJSON(lga, {
                style: {
                    fillColor: fillColor,
                    fillOpacity: 0.8,
                    weight: 2,
                    color: 'white'
                }
            }).addTo(map).eachLayer(function (layer) {
                layer.on('click', function () {
                    var regionId = layer.feature;
                    console.log(regionId)
                    var regionName = layer.feature.properties.lga_name_long;
                    updateDataInfo(regionName)
                });
            })
        }
    });
});
