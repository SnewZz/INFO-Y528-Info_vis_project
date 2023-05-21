/**
 * A function that give an appropriate color to represent the number of city of the dataset in a region.
 *
 * @param {number} n - The number of city in a region for which we want the color
 * @returns {string} The color, if the number of city is close to 40 it will be darker blue, else lighter blue. If the number is 0 the color is white.
 */
function getColor(avgTemperature, minTemperature, maxTemperature, red) {
    // Define the minimum and maximum temperature range for color mapping
    var minTemp = minTemperature; // Minimum temperature
    var maxTemp = maxTemperature; // Maximum temperature

    var colorRange = [];
    // Define the color range from light red to dark red
    if (red) {
        colorRange = ['#FFCDD2', '#EF5350', '#E53935', '#D32F2F', '#C62828', '#B71C1C', '#D50000', '#FF1744', '#F50057', '#FF4081'];
    } else {
        colorRange = ['#E1F5FE', '#B3E5FC', '#81D4FA', '#4FC3F7', '#29B6F6', '#03A9F4', '#039BE5', '#0288D1', '#0277BD', '#01579B'];
    }

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

function updateColdestCities(){
    const url = `/api/coldestCities?year=${getYear()}&season=${getSeason()}`;
    fetch(url).then(data => {
        return data.json()
    }).then(res => {
        document.getElementById("cold1").innerText = res[0].name+" "+res[0].temp;
        document.getElementById("cold2").innerText = res[1].name+" "+res[1].temp;
        document.getElementById("cold3").innerText = res[2].name+" "+res[2].temp;
    })
}

function updateHottestCities(){
    const url = `/api/hottestCities?year=${getYear()}&season=${getSeason()}`;
    fetch(url).then(data => {
        return data.json()
    }).then(res => {
        document.getElementById("hot1").innerText = res[0].name+" "+res[0].temp;
        document.getElementById("hot2").innerText = res[1].name+" "+res[1].temp;
        document.getElementById("hot3").innerText = res[2].name+" "+res[2].temp;
    })
}

function updateRainiestCities(){
    const url = `/api/rainiestCities?year=${getYear()}&season=${getSeason()}`;
    fetch(url).then(data => {
        return data.json()
    }).then(res => {
        document.getElementById("rain1").innerText = res[0].name+" "+res[0].rainLvl;
        document.getElementById("rain2").innerText = res[1].name+" "+res[1].rainLvl;
        document.getElementById("rain3").innerText = res[2].name+" "+res[2].rainLvl;
    })
}

function updateSunniestCities(){
    const url = `/api/suniestCities?year=${getYear()}&season=${getSeason()}`;
    fetch(url).then(data => {
        return data.json()
    }).then(res => {
        document.getElementById("sun1").innerText = res[0].name+" "+res[0].sunLvl;
        document.getElementById("sun2").innerText = res[1].name+" "+res[1].sunLvl;
        document.getElementById("sun3").innerText = res[2].name+" "+res[2].sunLvl;
    })
}

function updateBestCitiesInfo() {
    updateColdestCities();
    updateHottestCities();
    updateRainiestCities();
    updateSunniestCities();
}

function updateTemporalityInfo() {
    const selectedYearSpan = document.getElementById("selected_year");
    selectedYearSpan.textContent = getYear();
    const selectedSeasonSpan = document.getElementById("selected_season");
    selectedSeasonSpan.textContent = getSeason();
}

async function getRegions() {
    const httpResponse = await fetch(`/api/regionsGeoJSON`);
    const regions = await httpResponse.json();

    return regions;
}

function getCityRegion(lga,regions){
    for (var i = 0; i < regions.features.length; i++){
        if (lga.name === regions.features[i].properties.lga_name_long[0]){
            return regions.features[i]
        }
    }
}

function updateMap(regions, data) {

    // Remove previous layers from the map
    for (var i = 0; i < regionLayers.length; i++) {
        map.removeLayer(regionLayers[i]);
    }
    regionLayers = [];

    var minData = 100;
    var maxData = -100;
    data.forEach(element => {
        minData = element.avgData < minData ? element.avgData : minData;
        maxData = element.avgData > maxData ? element.avgData : maxData;
    });

    for (var i = 0; i < regions.features.length; i++) {
        var lga = data[i];
        //console.log(lga);
        if (lga !== undefined) {
            var isRed = (currMode == "option2" || currMode == "option4");
            var fillColor = getColor(data[i].avgData, minData, maxData, isRed);
            var layer = L.geoJSON(getCityRegion(lga,regions), {
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
                    //var regionId = layer.feature;
                    var regionName = layer.feature.properties.lga_name_long;
                    updateDataInfo(regionName)
                    displayCitiesRegion(regionName)
                });
            })
        }
    }
}

function getYear() {
    return slider1.value;
}

function getSeason() {
    return buttonSeason.value;
}

function getBaseUrlFromMode(mode) {
    var url = ""
    switch (mode) {
        case "option1":
            url = "/api/avgLowestTemperature";
            break;
        case "option2":
            url = "/api/avgHighestTemperature";
            break;
        case "option3":
            url = "/api/avgRain";
            break;
        case "option4":
            url = "/api/avgSunshine";
            break;
        default:
            console.log("Invalid mode");
            break;
    }
    return url;
}

function mapModeHandler() {
    if (currMode != null) {
        $('.alert').addClass('d-none')
        const year = getYear()
        const season = getSeason();
        const mode = currMode;
        const baseUrl = getBaseUrlFromMode(mode);
        const url = baseUrl + `?year=${year}&season=${season}`;
        console.log(url)
        fetch(url).then(data => {
            return data.json()
        }).then(res => {
            //console.log(regions)
            updateMap(regions, res)
        })
    } else {
        // Select the alert element
        const alertElement = $('.alert');

        // Remove the d-none class to show the alert
        alertElement.removeClass('d-none');
    }
}

function removerMarkers(){
    markers.forEach(function(marker){
        map.removeLayer(marker);
    })
}

function placeMarker(city_name){
    const url = `/api/coordinateCities?city=${city_name}`;
    fetch(url).then(data => {
        return data.json()
    }).then(res => {
        var marker = L.marker([res[0],res[1]]);
        marker.on('mouseover', function (e) {
            this.openPopup();
        });
        marker.on('mouseout', function (e) {
            this.closePopup();
        });
        marker.on('click', function (e) {
            console.log("Display graphics"); //Put the function that display the graphics !!! 
        });
        marker.addTo(map);
        marker.bindPopup(city_name[0]);
        markers.push(marker);
    })
}

function displayCitiesRegion(regionName){
    removerMarkers();
    //1) Get the city in the region 
    //2) Display them 
}

// Create Leaflet map
var map = L.map('map',{
    minZoom:3.5,
    maxZoom:10,
}).setView([-25, 135],3.5);

var regionLayers = [];
var markers = [];


// Add tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
}).addTo(map);


    //map.setZoom(0);

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

const buttonSeason = document.getElementById("select-season");

const radioContainer = document.querySelector('#radioContainer');
var currMode = null;
updateTemporalityInfo();
updateBestCitiesInfo();
radioContainer.addEventListener('change', (event) => {
    const checkedButton = event.target;
    if (checkedButton.matches('input[name="mode"]')) {
        currMode = checkedButton.value;
        removerMarkers();
        mapModeHandler();
    }
});

/**/


slider1.addEventListener("change", async (event) => {
    mapModeHandler();
    updateTemporalityInfo();
    updateBestCitiesInfo();
    result1.textContent = "Year : " + event.target.value;
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

var boutons = document.querySelectorAll("new_link");

boutons.forEach(function(btn){
    btn.addEventListener("click",(event) =>{
        var city_name = document.getElementById(event.target.id).innerText.match(/[a-zA-Z]+/g);
        removerMarkers();
        placeMarker(city_name);
    });
})



