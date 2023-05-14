/**
 * A function that give an appropriate color to represent the number of city of the dataset in a region.
 *
 * @param {number} n - The number of city in a region for which we want the color
 * @returns {string} The color, if the number of city is close to 40 it will be darker blue, else lighter blue. If the number is 0 the color is white.
 */

var cities = [];
var citiesPerRegion = [];
var regions = [];

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

function updateDataInfo(e) {
    document.getElementById('data-info').innerText = e;
}

function loadCities() {
    //var cities = []

    d3.csv("../static/data/coord_cities.csv").then(function (data) {
        data.forEach(function (d) {
            cities.push({
                id: parseInt(d.id_location),
                name: d.city,
                lat: parseInt(d.lat),
                lng: parseInt(d.long),
                state: d.state,
                lga: d.lga,
            });
        });
    });

    return cities;
}

function loadCitiesPerRegion(cities) {
    var citiesPerRegion = {};
    $.getJSON("../static/geoJSON/local-government-area.geojson", function (data) {

        for (var i = 0; i < data.features.length; i++) {
            citiesPerRegion[i] = [];
            var lga = data.features[i];
            for (var j = 0; j < cities.length; j++) {
                var city = cities[j];
                var point = turf.point([city.lng, city.lat]);
                if (turf.booleanPointInPolygon(point, lga)) {
                    citiesPerRegion[i].push(city);
                }
            }
        }
    });

    return citiesPerRegion;
}

function loadRegions() {
    var regions;
    $.getJSON("../static/geoJSON/local-government-area.geojson", function (data) {
        regions = data;
    });
    return regions;
}

function computeNbCitiesPerRegion() {

}

function updateMap(regions, data) {
    for (var i = 0; i < regions.features.length; i++){
        var lga = data.features[i];
        var fillColor = getColor(data[i])
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
}

function getTemperatureYear(year) {
    console.log(year)
    var filteredData;
    (d3.csv("../static/data/data_map.csv").then(function (data) {
        console.log("ok")
        console.log(data[0].End_date.split("-")[0] === year)
        filteredData = data.filter(function (d) { return d.End_date.split("-")[0] === year.toString(); })
        return filteredData
    }))
    //return filteredData;
}

function getHotestCities(year,season) {
    d3.csv("../static/data/Datamap_1.csv").then(function (data) {
        var best_cities = [];
        var best_temp = [];
        for (let i = 0; i < cities.length; i++){
            var temperatures = data.filter(function (d) { return d.Season === season && d.city === cities[i].name && d.Start_date.split("-")[0] === year.toString()});
            if (best_cities.length < 3){
                best_cities.push(temperatures[0].city);
                best_temp.push(parseFloat(temperatures[0].TempMax));
            }
            else{
                //console.log("Yes")
                console.log(Math.min(best_temp))
                //console.log(Math.min(parseFloat(best_temp)));// < temperatures[0].TempMax)
                if (Math.min(best_temp) < temperatures[0].TempMax){
                    //console.log("Yes");
                    var index = best_temp.indexOf(Math.min(best_temp));
                    best_cities[index] = temperatures[0].city;
                    best_temp[index] = temperatures[0].TempMax;
                    //console.log(best_cities[0])
                }
            }
        }   
        console.log(best_cities);
        return best_cities
    })
    //return filteredData;
}

function avgOnList(list){
    var totalValue = 0;
    for(var elt in list){
        totalValue += elt;
    }
    var avg = totalValue/list.length;
    return avg;
}


function getTemperatureAverageYear(data, citiesPerRegion) {
    var avgTemperatureRegion = [];
    for (var region in citiesPerRegion) {
        var temperatures = data.filter(function (d) { return d.Season === "Summer" && region.includes(d.city)});
        avgTemperatureRegion.push(avgOnList(temperatures));
    }
    return avgTemperatureRegion;
}


// Create Leaflet map
var map = L.map('map').setView([-25, 135], 4);


// Add tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
}).addTo(map);

// var cities = loadCities();



const slider1 = document.getElementById("slider1");
const slider2 = document.getElementById("slider2");

const result1 = document.getElementById("result1");
const result2 = document.getElementById("result2");

const radio_btn_1= document.getElementById("r1");
const radio_btn_2= document.getElementById("r2");
const radio_btn_3= document.getElementById("r3");
const radio_btn_4= document.getElementById("r4");

const year_select=document.getElementById("Year");
const season_select=document.getElementById("Season");

year_select.addEventListener('change',event=>{
    console.log(event.target.value);
    document.getElementById("selected_year").innerHTML = event.target.value;
});

season_select.addEventListener('change',event=>{
    console.log(event.target.value);
    document.getElementById("selected_season").innerHTML = event.target.value;
});

//Function that initialise everything
window.addEventListener('load',function(){
    document.getElementById("selected_year").innerHTML = this.document.getElementById("Year").value;
    document.getElementById("selected_season").innerHTML = this.document.getElementById("Season").value;
    //Chercher les villes les plus chaudes en 2009
    loadCities();
    loadCitiesPerRegion(cities);
    loadRegions();
    getHotestCities(2010,"Summer");
    
});

radio_btn_1.addEventListener('change', () => {
    console.log('Bouton radio sélectionné:', "Display min temp");
  });
  
radio_btn_2.addEventListener('change', () => {
    console.log('Bouton radio sélectionné:', "Display max temp");
  });

radio_btn_3.addEventListener('change', () => {
    console.log('Bouton radio sélectionné:', "Display rainfall");
    });

radio_btn_4.addEventListener('change', () => {
    console.log('Bouton radio sélectionné:', "Display sunshine");
    });
  
slider1.addEventListener("change", async (event) => {

    data = await getTemperatureYear(event.target.value);
    console.log(typeof data)
    console.log(data)
    dataPerRegion = getTemperatureAverageYear(data, citiesPerRegion);
    updateMap(dataPerRegion, regions);
    // if (event.target.value == ) {

    //     d3.csv("../static/data/data_map.csv").then(function (data) {
    //         // var filteredData = data.filter(function (d) { return d.population > 1000000; });
    //         // var cities = filteredData.map(function (d) { return d.city; });
    //         // var jane = data.filter(function(d) { return d.city === 'Melbourne'; });
    //         // var population = filteredData.map(function (d) { return d.population; });
    //         // var arr = Object.entries(cities)

    //         var barColors = "red";

    //         new Chart("chart", {
    //             type: "bar",
    //             data: {
    //                 labels: cities,
    //                 datasets: [{
    //                     backgroundColor: barColors,
    //                     data: population
    //                 }]
    //             },
    //             options: {
    //                 legend: { display: false },
    //                 scales: {
    //                     yAxes: [{
    //                         ticks: {
    //                             beginAtZero: true
    //                         }
    //                     }],
    //                 }
    //             }
    //         });
    //         console.log(filteredData)

    //     })
    // }

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

