function getColorByTemperature(temperature) {
    var color;

    if (temperature <= 5) {
        color = '#313695'; 
    } else if (temperature <= 10) {
        color = '#588BBF'; 
    } else if (temperature <= 15) {
        color = '#A3D3E5'; 
    } else if (temperature <= 20) {
        color = '#E8F6E8'; 
    } else if (temperature <= 25) {
        color = '#FEE89C'; 
    } else if (temperature <= 30) {
        color = '#FBA55C'; 
    } else if (temperature <= 35) {
        color = '#E24832'; 
    } else {
        color = '#A50026';
    }

    return color;
}

function getColorBySunshine(sun) {
    var color;

    if (sun <= 2) {
        color = '#313695'; 
    } else if (sun <= 4) {
        color = '#588BBF'; 
    } else if (sun <= 6) {
        color = '#A3D3E5'; 
    } else if (sun <= 8) {
        color = '#E8F6E8'; 
    } else if (sun <= 10) {
        color = '#FEE89C'; 
    } else if (sun <= 12) {
        color = '#FBA55C'; 
    } else if (sun <= 14) {
        color = '#E24832'; 
    } else {
        color = '#A50026';
    }

    return color;
}

function getColorByRain(rain) {
    var color;

    if (rain <= 4) {
        color = '#A50026'; 
    } else if (rain <= 8) {
        color = '#E24832'; 
    } else if (rain <= 12) {
        color = '#FBA55C'; 
    } else if (rain <= 16) {
        color = '#FEE89C'; 
    } else if (rain <= 20) {
        color = '#E8F6E8'; 
    } else if (rain <= 24) {
        color = '#A3D3E5'; 
    } else if (rain <= 28) {
        color = '#588BBF'; 
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
                    //Mettre graphique pour les régions ici. 
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


function placeMarker(city_name,bool){
    if (city_name != "-"){
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
            if (bool){
                if (!first_time){
                    removeData(chart1,1);
                    removeData(chart2,1);
                    removeData(chart3,1);
                    removeData(chart4,1);                
                    const url1 = `/api/RainByMonth?year=${getYearSlider3()}&city=${city_name}`;
                    fetch(url1).then(data => {
                        return data.json()
                    }).then(res => {   
                        addData(chart1,[city_name[0],getYearSlider3()],res,1); 
                    });
                    const url2 = `/api/SunByMonth?year=${getYearSlider3()}&city=${city_name}`;
                    fetch(url2).then(data => {
                        return data.json()
                    }).then(res => {   
                        addData(chart2,[city_name[0],getYearSlider3()],res,1); 
                    });
                    const url3 = `/api/TminByMonth?year=${getYearSlider3()}&city=${city_name}`;
                    fetch(url3).then(data => {
                        return data.json()
                    }).then(res => {   
                        addData(chart3,[city_name[0],getYearSlider3()],res,1); 
                    });
                    const url4 = `/api/TmaxByMonth?year=${getYearSlider3()}&city=${city_name}`;
                    fetch(url4).then(data => {
                        return data.json()
                    }).then(res => {   
                        addData(chart4,[city_name[0],getYearSlider3()],res,1); 
                    });
                }
            }
            else{
                if (! first_time){
                    chart1.destroy();
                    chart2.destroy();
                    chart3.destroy();
                    chart4.destroy();
                }
                first_time = false;
                compare_city.selectedIndex = 0;
                createChartRain("chart1",city_name);
                createChartSun("chart2",city_name);
                createChartTmin("chart3",city_name);
                createChartTmax("chart4",city_name);
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


//index = 0 ==> Data from the map
//index = 1 ==> Data for the comparison
function addData(chart, label, data,index) {
    if (chart.data.datasets.length < 2){
        if (index == 0){
            if (chart == chart3 || chart == chart4){
                chart.data.datasets.splice(index,1,{
                    label: label,
                    data: data,
                    backgroundColor: '#004D40',
                    borderColor: '#004D40',
                    fill:false,
                    borderWidth: 2
                })
            }
            else{
                chart.data.datasets.splice(index,1,{
                    label: label,
                    data: data,
                    backgroundColor: [
                        '#F5793A',
                        '#F5793A',
                        '#A95AA1',
                        '#A95AA1',
                        '#A95AA1',
                        '#0F2080',
                        '#0F2080',
                        '#0F2080',
                        '#85C0F9',
                        '#85C0F9',
                        '#85C0F9',
                        '#F5793A'
                      ] // Couleur de remplissage pour le type de données 2
                })
            }
        }
        else{
            if (chart == chart3 || chart == chart4){
                chart.data.datasets.splice(index,1,{
                    label: label,
                    data: data,
                    backgroundColor: '#FFC107',
                    borderColor: '#FFC107',
                    borderWidth: 2,
                    fill:false
                })
            }
            else{
                chart.data.datasets.splice(index,1,{
                    label: label,
                    data: data,
                    backgroundColor: [
                        'white','white','white','white','white','white','white','white','white','white','white','white'
                      ],
                    borderWidth: 5,
                    borderColor: [
                        '#F5793A',
                        '#F5793A',
                        '#A95AA1',
                        '#A95AA1',
                        '#A95AA1',
                        '#0F2080',
                        '#0F2080',
                        '#0F2080',
                        '#85C0F9',
                        '#85C0F9',
                        '#85C0F9',
                        '#F5793A'
                      ],
                })
            }
        }
        chart.update();
    }
}

function removeData(chart,index) {
    if (chart.data.datasets.length > 1){
        chart.data.datasets.splice(index,1);
        chart.update();
    }
}

async function createChartTmax(chartID,city){
    const ctx = document.getElementById(chartID);
    const url = `/api/TmaxByMonth?year=${getYear()}&city=${city}`;
    chart4 = await fetch(url).then(data => {
        return data.json()
    }).then(res => {
        return new Chart(ctx, {
            type: 'line',
            data: {
              labels: ['January', 'February', 'March', 'April', 'May', 'June','July','August','September','October','November','December'],
              datasets: [{
                label: city.concat(getYear()),
                data: res,
                //borderWidth: 1,
                borderWidth: 2,
                fill: false,
                backgroundColor: '#004D40',
                borderColor: '#004D40',    
              }]
            },
            options: {
                responsive: true,
                title:{
                    display: true,
                    text: 'Temperature max by month'
                },
                legend: {
                    position: 'right',
                    display:true,
                    maxHeight: 10,
                    maxWidth: 10
                  },
                scales: {
                    yAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: 'Temperature max (°C)',
                          },
                        }],
                    xAxes: [
                        {
                            scaleLabel: {
                            display: true,
                            labelString: 'Months',
                            },
                        }],
                }
            }
          });
    })
}

async function createChartTmin(chartID,city){
    const ctx = document.getElementById(chartID);
    const url = `/api/TminByMonth?year=${getYear()}&city=${city}`;
    chart3 = await fetch(url).then(data => {
        return data.json()
    }).then(res => {
        return new Chart(ctx, {
            type: 'line',
            data: {
              labels: ['January', 'February', 'March', 'April', 'May', 'June','July','August','September','October','November','December'],
              datasets: [{
                label: city.concat(getYear()),
                data: res,
                fill:false,
                borderWidth: 2,
                backgroundColor: '#004D40',
                borderColor: '#004D40',
              }]
            },
            options: {
                responsive: true,
                title:{
                    display: true,
                    text: 'Temperature min by month'
                },
                legend: {
                    position: 'right',
                    display:true,
                    maxHeight: 10,
                    maxWidth: 10
                  },
                scales: {
                    yAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: 'Temperature min (°C)',
                          },
                        }],
                    xAxes: [
                        {
                            scaleLabel: {
                            display: true,
                            labelString: 'Months',
                            },
                            
                        }],
                }
            }
          });
    })
}

async function createChartSun(chartID,city){
    const ctx = document.getElementById(chartID);
    const url = `/api/SunByMonth?year=${getYear()}&city=${city}`;
    chart2 = await fetch(url).then(data => {
        return data.json()
    }).then(res => {
        return new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['January', 'February', 'March', 'April', 'May', 'June','July','August','September','October','November','December'],
              datasets: [{
                label: city.concat(getYear()),
                data: res,
                borderWidth: 1,
                backgroundColor: [
                    '#F5793A',
                    '#F5793A',
                    '#A95AA1',
                    '#A95AA1',
                    '#A95AA1',
                    '#0F2080',
                    '#0F2080',
                    '#0F2080',
                    '#85C0F9',
                    '#85C0F9',
                    '#85C0F9',
                    '#F5793A'
                  ]
              }]
            },
            options: {
                responsive: true,
                title:{
                    display: true,
                    text: 'Average number of hours of sunshine by month'
                },
                legend: {
                    position: 'right',
                    display:true,
                    maxHeight: 10,
                    maxWidth: 10
                  },
                scales: {
                    yAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: 'Sunshine (h/day)',
                          },
                        }],
                    xAxes: [
                        {
                            scaleLabel: {
                            display: true,
                            labelString: 'Months',
                            },
                        }]
                }
            }
          });
    })
}

async function createChartRain(chartID,city){
    const ctx = document.getElementById(chartID);
    const url = `/api/RainByMonth?year=${getYear()}&city=${city}`;
    chart1 = await fetch(url).then(data => {
        return data.json()
    }).then(res => {
        return new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['January', 'February', 'March', 'April', 'May', 'June','July','August','September','October','November','December'],
              datasets: [{
                label: city.concat(getYear()),
                data: res,
                borderWidth: 1,
                backgroundColor: [
                    '#F5793A',
                    '#F5793A',
                    '#A95AA1',
                    '#A95AA1',
                    '#A95AA1',
                    '#0F2080',
                    '#0F2080',
                    '#0F2080',
                    '#85C0F9',
                    '#85C0F9',
                    '#85C0F9',
                    '#F5793A'
                  ]
              }]
            },
            options: {
                responsive: true,
                title:{
                    display: true,
                    text: 'Average amount of rainfall by month'
                },
                legend: {
                    position: 'right',
                    display:true,
                    maxHeight: 10,
                    maxWidth: 10
                  },
                scales: {
                    yAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: 'Rainfall (mm/day)',
                          },
                        }],
                    xAxes: [
                        {
                            scaleLabel: {
                            display: true,
                            labelString: 'Months',
                            },
                        }]
                }
            }
          });
    })
}

function displayCitiesRegion(regionName){
    removerMarkers(false);
    removerMarkers(true);
    if (! first_time){
        chart1.destroy();
        chart2.destroy();
        chart3.destroy();
        chart4.destroy();
    }
    compare_city.selectedIndex = 0;
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
                first_time = false;
                removerMarkers(true);
                compare_city.selectedIndex = 0;
                createChartRain("chart1",[d[2]]);
                createChartSun("chart2",[d[2]]);
                createChartTmin("chart3",[d[2]]);
                createChartTmax("chart4",[d[2]]);
            });
            //Display the graphics for the whole region!!!
            marker.addTo(map);
            marker.bindPopup(d[2]);
            markers.push(marker);
        });
    });
}

function updateLegend(mode) {
    if (legend) {
        // If the legend already exist, remove it from the map
        legend.remove();
    }

    legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        
        var div = L.DomUtil.create('div', 'info legend');
        var grades = [];
        var labels = [];

        // Define grades and labels in function of the selected mode
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

function updateRain(year,index){
    city_name = chart1.chart.config.data.datasets[index].label[0];
    const url1 = `/api/RainByMonth?year=${year}&city=${city_name}`;
    fetch(url1).then(data => {
        return data.json()
    }).then(res => {   
        chart1.chart.config.data.datasets[index].label = [city_name].concat(year);
        chart1.chart.config.data.datasets[index].data = res;
        chart1.update()
    });
}

function updateSun(year,index){
    city_name = chart2.chart.config.data.datasets[index].label[0] 
    const url1 = `/api/SunByMonth?year=${year}&city=${city_name}`;
    fetch(url1).then(data => {
        return data.json()
    }).then(res => {   
        chart2.chart.config.data.datasets[index].label = [city_name].concat(year);
        chart2.chart.config.data.datasets[index].data = res;
        chart2.update()
    });
}

function updateTmin(year,index){
    city_name = chart3.chart.config.data.datasets[index].label[0] 
    const url1 = `/api/TminByMonth?year=${year}&city=${city_name}`;
    fetch(url1).then(data => {
        return data.json()
    }).then(res => {   
        chart3.chart.config.data.datasets[index].label = [city_name].concat(year);
        chart3.chart.config.data.datasets[index].data = res;
        chart3.update()
    });
}

function updateTmax(year,index){
    city_name = chart4.chart.config.data.datasets[index].label[0] 
    const url1 = `/api/TmaxByMonth?year=${year}&city=${city_name}`;
    fetch(url1).then(data => {
        return data.json()
    }).then(res => {   
        chart4.chart.config.data.datasets[index].label = [city_name].concat(year);
        chart4.chart.config.data.datasets[index].data = res;
        chart4.update()
    });
}



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
const slider3 = document.getElementById("slider3");

const result1 = document.getElementById("result1");
const result3 = document.getElementById("result3");


var chart1;
var chart2;
var chart3;
var chart4;

var first_time = true;


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
        removerMarkers(true);
        compare_city.selectedIndex = 0
        mapModeHandler();
        if (!first_time){
            chart1.destroy();
            chart2.destroy();
            chart3.destroy();
            chart4.destroy();
        }
    }
});

buttonSeason.addEventListener('change', (event) => {
    const checkedButton = event.target;
    mapModeHandler()
    removerMarkers(true)
    updateBestCitiesInfo();
    updateTemporalityInfo();
    if (compare_city.selectedIndex != 0)
    {
        removeData(chart1,1);
        removeData(chart2,1);
        removeData(chart3,1);
        removeData(chart4,1);
        compare_city.selectedIndex = 0;
    }
    
})


slider1.addEventListener("change", async (event) => {
    mapModeHandler();
    updateTemporalityInfo();
    updateBestCitiesInfo();
    removerMarkers(true);
    result1.textContent = "Year : " + event.target.value;
    compare_city.selectedIndex = 0;
    if (!first_time){
        removeData(chart1,1);
        removeData(chart2,1);
        removeData(chart3,1);
        removeData(chart4,1);
        updateRain(event.target.value,0);
        updateSun(event.target.value,0);
        updateTmin(event.target.value,0);
        updateTmax(event.target.value,0);
    }
    
})

slider3.addEventListener("change", (event) => {
    result3.textContent = "Year : " + event.target.value;
    if ((compare_city.selectedIndex != 0 && markers.length > 0)){
        updateRain(event.target.value,1);
        updateSun(event.target.value,1);
        updateTmin(event.target.value,1);
        updateTmax(event.target.value,1);
    }
});


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
    removerMarkers(true);
    var lst = [];
    lst.push(event.target.value);
    placeMarker(lst, false);
})

boutons.forEach(function (btn) {
    btn.addEventListener("click", (event) => {
        var city_name = document.getElementById(event.target.id).innerText.match(/[a-zA-Z]+/g);
        removerMarkers(false);
        removerMarkers(true);
        placeMarker(city_name,false);
    });
})


var legend = null;



