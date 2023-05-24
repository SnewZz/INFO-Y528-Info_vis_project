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

function getColorByTemperature(temperature) {
    var color;

    if (temperature <= 5) {
        color = '#313695'; // Bleu foncé
    } else if (temperature <= 10) {
        color = '#588BBF'; // Turquoise clair
    } else if (temperature <= 15) {
        color = '#A3D3E5'; // Vert printemps
    } else if (temperature <= 20) {
        color = '#E8F6E8'; // Jaune
    } else if (temperature <= 25) {
        color = '#FEE89C'; // Orange
    } else if (temperature <= 30) {
        color = '#FBA55C'; // Orange-rouge
    } else if (temperature <= 35) {
        color = '#E24832'; // Rouge
    } else {
        color = '#A50026';
    }

    return color;
}

function getColorBySunshine(sun) {
    var color;

    if (sun <= 2) {
        color = '#313695'; // Bleu foncé
    } else if (sun <= 4) {
        color = '#588BBF'; // Turquoise clair
    } else if (sun <= 6) {
        color = '#A3D3E5'; // Vert printemps
    } else if (sun <= 8) {
        color = '#E8F6E8'; // Jaune
    } else if (sun <= 10) {
        color = '#FEE89C'; // Orange
    } else if (sun <= 12) {
        color = '#FBA55C'; // Orange-rouge
    } else if (sun <= 14) {
        color = '#E24832'; // Rouge
    } else {
        color = '#A50026';
    }

    return color;
}

function getColorByRain(rain) {
    var color;

    if (rain <= 4) {
        color = '#A50026'; // Bleu foncé
    } else if (rain <= 8) {
        color = '#E24832'; // Turquoise clair
    } else if (rain <= 12) {
        color = '#FBA55C'; // Vert printemps
    } else if (rain <= 16) {
        color = '#FEE89C'; // Jaune
    } else if (rain <= 20) {
        color = '#E8F6E8'; // Orange
    } else if (rain <= 24) {
        color = '#A3D3E5'; // Orange-rouge
    } else if (rain <= 28) {
        color = '#588BBF'; // Rouge
    } else {
        color = '#313695';
    }

    return color;
}

function updateColdestCities() {
    const url = `/api/coldestCities?year=${getYear()}&season=${getSeason()}`;
    fetch(url).then(data => {
        return data.json()
    }).then(res => {
        document.getElementById("cold1").innerText = res[0].name + " " + res[0].temp;
        document.getElementById("cold2").innerText = res[1].name + " " + res[1].temp;
        document.getElementById("cold3").innerText = res[2].name + " " + res[2].temp;
    })
}

function updateHottestCities() {
    const url = `/api/hottestCities?year=${getYear()}&season=${getSeason()}`;
    fetch(url).then(data => {
        return data.json()
    }).then(res => {
        document.getElementById("hot1").innerText = res[0].name + " " + res[0].temp;
        document.getElementById("hot2").innerText = res[1].name + " " + res[1].temp;
        document.getElementById("hot3").innerText = res[2].name + " " + res[2].temp;
    })
}

function updateRainiestCities() {
    const url = `/api/rainiestCities?year=${getYear()}&season=${getSeason()}`;
    fetch(url).then(data => {
        return data.json()
    }).then(res => {
        document.getElementById("rain1").innerText = res[0].name + " " + res[0].rainLvl;
        document.getElementById("rain2").innerText = res[1].name + " " + res[1].rainLvl;
        document.getElementById("rain3").innerText = res[2].name + " " + res[2].rainLvl;
    })
}

function updateSunniestCities() {
    const url = `/api/suniestCities?year=${getYear()}&season=${getSeason()}`;
    fetch(url).then(data => {
        return data.json()
    }).then(res => {
        document.getElementById("sun1").innerText = res[0].name + " " + res[0].sunLvl;
        document.getElementById("sun2").innerText = res[1].name + " " + res[1].sunLvl;
        document.getElementById("sun3").innerText = res[2].name + " " + res[2].sunLvl;
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

function getCityRegion(lga, regions) {
    for (var i = 0; i < regions.features.length; i++) {
        if (lga.name === regions.features[i].properties.lga_name_long[0]) {
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
        if (lga !== undefined) {
            var fillColor;
            if(currMode === "option3"){
                fillColor = getColorByRain(data[i].avgData)
            } else if(currMode === "option4"){
                fillColor = getColorBySunshine(data[i].avgData)
            }else{
                fillColor = getColorByTemperature(data[i].avgData);
            }
            var layer = L.geoJSON(getCityRegion(lga, regions), {
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
                    //updateDataInfo(regionName)
                    displayCitiesRegion(regionName)
                });
            })
        }
    }
}

function getYearSlider3() {
    return slider3.value;
}

function getYear() {
    return slider1.value;
}

function getComparedCity() {
    return compare_city.value;
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
        updateLegend(mode);
        fetch(url).then(data => {
            return data.json()
        }).then(res => {
            updateMap(regions, res)
        })
    } else {
        // Select the alert element
        const alertElement = $('.alert');

        // Remove the d-none class to show the alert
        alertElement.removeClass('d-none');
    }
}

function removerMarkers(bool) {
    if (bool) {
        comparison_marker.forEach(function (marker) {
            map.removeLayer(marker);
        })
    }
    else {
        markers.forEach(function (marker) {
            map.removeLayer(marker);
        })
    }

}

function placeMarker(city_name, bool) {
    if (city_name != "-") {
        //console.log(city_name)
        const url = `/api/coordinateCities?city=${city_name}`;
        fetch(url).then(data => {
            return data.json()
        }).then(res => {
            var marker = L.marker([res[0], res[1]]);
            marker.on('mouseover', function (e) {
                this.openPopup();
            });
            marker.on('mouseout', function (e) {
                this.closePopup();
            });
            if (bool) {
                marker.on('click', function (e) {
                    //Display the graphic on the graphic that is already printed (we add a layer on our graphic)
                });
            }
            else {
                marker.on('click', function (e) {
                    console.log("Display graphics");
                    //Display the graphics for the city
                });
            }

            marker.addTo(map);
            marker.bindPopup(city_name[0]);
            if (bool) {
                comparison_marker.push(marker);
            }
            else {
                markers.push(marker);
            }
        })
    }
}

function displayCitiesRegion(regionName) {
    console.log(regionName)
    removerMarkers(false);
    const url = `/api/citiesInRegion?region=${regionName}`;
    fetch(url).then(data => {
        return data.json()
    }).then(res => {
        res.forEach(function (d) {
            var marker = L.marker([d[3], d[4]]);
            marker.on('mouseover', function (e) {
                this.openPopup();
            });
            marker.on('mouseout', function (e) {
                this.closePopup();
            });
            marker.on('click', function (e) {
                console.log("Display graphics");
                //Put the function that display the graphics for the city!!! 
            });
            //Display the graphics for the whole region!!!
            marker.addTo(map);
            marker.bindPopup(d[2]);
            markers.push(marker);
        });
    });
}
// ------------------------------------------------------------------

function updateLegend(mode) {
    if (legend) {
        // Si la légende existe déjà, la retirer de la carte
        legend.remove();
    }

    legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        
        var div = L.DomUtil.create('div', 'info legend');
        var grades = [];
        var labels = [];

        // Déterminer les grades et les labels en fonction du mode sélectionné
        if (mode === "option1" || mode === "option2") {
            for (var i = 0; i <= 40; i += 5) {
                grades.push(i);
            }
            for (var i = 1; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColorByTemperature(grades[i-1] + 1) + '"></i> ' +
                    grades[i-1] + '&ndash;' + grades[i] + ' °C<br>';
            }
        } else if (mode === "option3") {
            for (var i = 0; i <= 28; i += 4) {
                grades.push(i);
            }
            for (var i = 1; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColorByRain(grades[i-1] + 1) + '"></i> ' +
                    grades[i-1] + '&ndash;' + grades[i] + ' mm/day<br>';
            }
        } else {
            for (var i = 0; i <= 14; i += 2) {
                grades.push(i);
            }
            for (var i = 1; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColorBySunshine(grades[i-1] + 1) + '"></i> ' +
                    grades[i-1] + '&ndash;' + grades[i] + ' hour/day<br>';
            }
        }

        return div;
    };

    legend.addTo(map);
}

// // Créez une fonction pour générer la légende
// function updateLegend() {

//     legend.onAdd = function (map) {
//         var div = L.DomUtil.create('div', 'info legend');
//         var grades = [];
//         for (var i = 0; i <= 40; i += 5) {
//             grades.push(i)
//         }
//         var labels = [];

//         for (var i = 1; i < grades.length; i++) {
//             div.innerHTML +=
//                 '<i style="background:' + getColorByTemperature(grades[i-1] + 1) + '"></i> ' +
//                 grades[i-1] + '&ndash;' + grades[i] + ' °C<br>';
//         }

//         return div;
//     };

//     legend.addTo(map);
// }

// Start of the code


var bounds = L.latLng(-26.36, 134.87).toBounds(4500000);

// Create Leaflet map
var map = L.map('map', {
    minZoom: 4,
    maxZoom: 10,
    maxBounds: bounds,
});

map.setView([-25, 135], 1);

var regionLayers = [];
var markers = [];
var comparison_marker = [];


// Add tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
}).addTo(map);


// get the regions
fetch(`/api/regionsGeoJSON`).then(data => {
    return data.json()
}).then(res => { regions = res; });

const slider1 = document.getElementById("slider1");
const slider2 = document.getElementById("slider2");
const slider3 = document.getElementById("slider3");

const result1 = document.getElementById("result1");
const result2 = document.getElementById("result2");
const result3 = document.getElementById("result3");

var chart1;
var chart2;
var chart3;
var chart4;


const buttonSeason = document.getElementById("select-season");
const radioContainer = document.querySelector('#radioContainer');

var currMode = null;

updateTemporalityInfo();
updateBestCitiesInfo();

radioContainer.addEventListener('change', (event) => {
    const checkedButton = event.target;
    if (checkedButton.matches('input[name="mode"]')) {
        currMode = checkedButton.value;
        removerMarkers(false);
        console.log("radioContainer")
        mapModeHandler();
    }
});


slider1.addEventListener("change", async (event) => {
    mapModeHandler();
    updateTemporalityInfo();
    updateBestCitiesInfo();
    result1.textContent = "Year : " + event.target.value;
});

slider2.addEventListener("change", async (event) => {
    // mapModeHandler();
    // updateTemporalityInfo();
    // updateBestCitiesInfo();
    result2.textContent = "Reference year : " + event.target.value;
})

var boutons = document.querySelectorAll("new_link");

var select_city = document.getElementById("selected-city");

var compare_city = document.getElementById("comparison-city");

compare_city.addEventListener("change", (event) => {
    removerMarkers(true);
    var lst = [];
    lst.push(event.target.value);
    placeMarker(lst, true);
})

select_city.addEventListener("change", (event) => {
    removerMarkers(false);
    var lst = [];
    lst.push(event.target.value);
    placeMarker(lst, false);
})

boutons.forEach(function (btn) {
    btn.addEventListener("click", (event) => {
        var city_name = document.getElementById(event.target.id).innerText.match(/[a-zA-Z]+/g);
        removerMarkers(false);
        placeMarker(city_name, false);
    });
})


var legend = null;



