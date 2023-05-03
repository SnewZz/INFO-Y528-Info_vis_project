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


document.addEventListener("DOMContentLoaded", function () {
    /**
     * Open and manipulate the csv file
     */
    d3.csv("../data/au.csv").then(function (data) {
        // Create Leaflet map
        var map = L.map('map').setView([-25, 135], 4);


        // Add tile layer to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
        }).addTo(map);

        var cities = [];

        var populationTotale = 0;
        data.forEach(function (d) {
            cities.push({
                name: d.city,
                lat: parseInt(d.lat),
                lng: parseInt(d.lng),
                pop: parseInt(d.population)
            });
            populationTotale += parseInt(d.population);
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
                }).addTo(map);
            }
            geoJSONLayer.eachLayer(function(layer){
                layer.on('click', function(){
                    var regionId = layer.feature.id;
                    var regionName = layer.feature.properties.lga_name_long;
                    updateDataInfo(regionName)
                })
            })
        });

        // Add markers with data to the map
        // var marker1 = L.marker([-36.0737, 146.9135]).addTo(map).bindPopup("Albury");
        // var marker2 = L.marker([-34.9285, 138.6007]).addTo(map).bindPopup("Adelaide");
        // var marker3 = L.marker([-35.0031, 117.8657]).addTo(map).bindPopup("Albany");
        // var marker4 = L.marker([-23.6980, 133.8807]).addTo(map).bindPopup("Alice Springs");

        // // Attach click event listener to markers
        // marker1.on('click', function () {
        //     updateDataInfo("Data for Marker 1");
        //     generateChart();
        // });

        // marker2.on('click', function () {
        //     updateDataInfo("Data for Marker 2");
        //     generateChart();
        // });

        // marker3.on('click', function () {
        //     updateDataInfo("Data for Marker 3");
        //     generateChart();
        // });

        // marker4.on('click', function () {
        //     updateDataInfo("Data for Marker 4");
        //     generateChart();
        // });

        // Update data info in the dashboard
        // function updateDataInfo(data) {
        //     document.getElementById('data-info').innerText = data;
        // }

        // // Generate random temperature data for the chart
        // function generateRandomTempData() {
        //     var tempData = [];
        //     for (var i = 0; i < 7; i++) { // Generating data for 7 months
        //         tempData.push(Math.floor(Math.random() * 20) + 10); // Random temperature between 10 and 30
        //     }
        //     return tempData;
        // }
        // var chart;
        // // Generate chart
        // function generateChart() {
        //     var ctx = document.getElementById('chart').getContext('2d');
        //     var tempData = generateRandomTempData();
        //     // Détruire l'instance précédente du graphique s'il en existe une
        //     if (typeof chart !== 'undefined') {
        //         chart.destroy();
        //     }
        //     chart = new Chart(ctx, {
        //         type: 'line',
        //         data: {
        //             labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        //             datasets: [{
        //                 label: 'Temperature',
        //                 data: tempData,
        //                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
        //                 borderColor: 'rgba(75, 192, 192, 1)',
        //                 borderWidth: 1
        //             }]
        //         },
        //         options: {
        //             responsive: true,
        //             maintainAspectRatio: false,
        //             scales: {
        //                 y: {
        //                     beginAtZero: true,
        //                     max: 40 // Set the maximum value on y-axis to 40
        //                 }
        //             }
        //         }
        //     });
        //     var chartContainer = document.getElementById('chart').parentNode;
        //     chartContainer.style.width = chart.width + "px";
        //     chartContainer.style.height = chart.height + "px";

        // }
    });
});