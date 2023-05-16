/**
 * A function that give an appropriate color to represent the number of city of the dataset in a region.
 *
 * @param {number} n - The number of city in a region for which we want the color
 * @returns {string} The color, if the number of city is close to 40 it will be darker blue, else lighter blue. If the number is 0 the color is white.
 */
// function getColor(n ,min, max) {
//     if (n === 0) {
//         return '#F0F0F0';
//     } else {
//         const baseColor = chroma('blue').saturate(0.8).brighten(1);
//         // Calculer la saturation en fonction du nombre de villes
//         const saturation = Math.min(n / 40, 1);
//         // Créer une couleur plus foncée en utilisant la fonction darken de chroma.js
//         return baseColor.darken(saturation * 2);
//     }
// }

function getColor(avgTemperature, minTemperature, maxTemperature) {
    // Define the minimum and maximum temperature range for color mapping
    var minTemp = minTemperature; // Minimum temperature
    var maxTemp = maxTemperature; // Maximum temperature

    // Define the color range from light red to dark red
    var colorRange = ['#FFCDD2', '#EF5350', '#E53935', '#D32F2F', '#C62828', '#B71C1C', '#D50000', '#FF1744', '#F50057', '#FF4081'];

    // Calculate the normalized value (between 0 and 1) for the average temperature
    var normalizedValue = (avgTemperature - minTemp) / (maxTemp - minTemp);

    // Calculate the index in the color range array
    var colorIndex = Math.round(normalizedValue * (colorRange.length - 1));

    // Return the color corresponding to the index
    return colorRange[colorIndex];
}



function updateDataInfo(e) {
    document.getElementById('data-info').innerText = e;
}

async function getRegions() {
    const httpResponse = await fetch(`/api/regionsGeoJSON`);
    const regions = await httpResponse.json();

    return regions;
}

function loadCities() {
    var cities = []

    // d3.csv("../static/data/coord_cities.csv").then(function (data) {
    //     data.forEach(function (d) {
    //         cities.push({
    //             id: parseInt(d.id_location),
    //             name: d.city,
    //             lat: parseInt(d.lat),
    //             lng: parseInt(d.long),
    //             state: d.state,
    //             lga: d.lga,
    //         });
    //     });
    // });

    return cities;
}

// function loadCitiesPerRegion(cities) {
//     var citiesPerRegion = {};
//     $.getJSON("./geoJSON/local-government-area.geojson", function (data) {

//         for (var i = 0; i < data.features.length; i++) {
//             citiesPerRegion[i] = [];
//             var lga = data.features[i];
//             for (var j = 0; j < cities.length; j++) {
//                 var city = cities[j];
//                 var point = turf.point([city.lng, city.lat]);
//                 if (turf.booleanPointInPolygon(point, lga)) {
//                     citiesPerRegion[i].push(city);
//                 }
//             }
//         }
//     });

//     return citiesPerRegion;
//}

// function loadRegions() {
// var regions;
// $.getJSON("./geoJSON/local-government-area.geojson", function (data) {
// regions = data;
// console.log(regions)
// return regions;
// });
// }


function updateMap(regions, data) {

    // Remove previous layers from the map
    for (var i = 0; i < regionLayers.length; i++) {
        map.removeLayer(regionLayers[i]);
    }
    regionLayers = [];

    var minTemp = 100;
    var maxTemp = -100;
    data.forEach(element => {
        minTemp = element.avgTemperature < minTemp ? element.avgTemperature : minTemp;
        maxTemp = element.avgTemperature > maxTemp ? element.avgTemperature : maxTemp;
    });

    for (var i = 0; i < regions.features.length; i++) {
        var lga = data[i];
        if (lga !== undefined) {
            var fillColor = getColor(data[i].avgTemperature, minTemp, maxTemp);
            var layer = L.geoJSON(regions.features[i], {
                style: {
                    fillColor: fillColor,
                    fillOpacity: 0.8,
                    weight: 2,
                    color: 'white'
                }
            }).addTo(map);

            regionLayers.push(layer);

            layer.eachLayer(function (layer) {
                layer.on('click', function () {
                    var regionId = layer.feature;
                    var regionName = layer.feature.properties.lga_name_long;
                    updateDataInfo(regionName)
                });
            })
        }
    }
}

function avgOnList(list) {
    var totalValue = 0;
    for (var elt in list) {
        totalValue += elt;
    }
    var avg = totalValue / list.length;
    return avg;
}




// Create Leaflet map
var map = L.map('map').setView([-25, 135], 4);

var regionLayers = [];

// Add tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
}).addTo(map);

// var cities = loadCities();
//var citiesPerRegion = loadCitiesPerRegion(loadCities());

//const regions = await getRegions();
fetch(`/api/regionsGeoJSON`).then(data => {
    return data.json()
}).then(res => { regions = res; });

const slider1 = document.getElementById("slider1");
const slider2 = document.getElementById("slider2");

const result1 = document.getElementById("result1");
const result2 = document.getElementById("result2");

slider1.addEventListener("change", async (event) => {
    const url = `/api/avgTemperature?year=${event.target.value}&season=Winter`;
    fetch(url).then(data => {
        return data.json()
    }).then(res => {

        updateMap(regions, res)
    })
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
