// Need of running the "py -m http.server 8000" to work

document.addEventListener("DOMContentLoaded", function () {
    d3.csv("../data/au.csv").then(function (data) {
        // Create Leaflet map
        var map = L.map('map').setView([-25, 135], 4);


        // Add tile layer to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
        }).addTo(map);

        $.getJSON("../static/geoJSON/local-government-area.geojson", function(data) {
            // Création de la couche GeoJSON avec des options de style
            var myLayer = L.geoJSON(data, {
                style: function(feature) {
                    return {
                        color: "red",
                        weight: 2,
                        fillOpacity: 0.5
                    };
                },
                onEachFeature: function(feature, layer) {
                    layer.bindPopup(`<b>${feature.properties.name}</b>`);
                }
            }).addTo(map);
        });

        var cities = [
            // { name: "Sydney", lat: -33.865143, lng: 151.2099, temperature: 24 },
            // { name: "Melbourne", lat: -37.8136, lng: 144.9631, temperature: 18 },
            // { name: "Brisbane", lat: -27.4698, lng: 153.0251, temperature: 28 },
        ];

        // var populationTotale = 0;
        // data.forEach(function (d) {
        //     cities.push({
        //         name: d.city,
        //         lat: parseInt(d.lat),
        //         lng: parseInt(d.lng),
        //         pop: parseInt(d.population)
        //     });
        //     populationTotale += parseInt(d.population);
        // });



        // var circleOptions = {
        //     color: "red",
        //     fillColor: "#f03",
        //     fillOpacity: 0.5,
        //     weight: 1
        // };

        // for (var i = 0; i < cities.length; i++) {
        //     var city = cities[i];
        //     var circle = L.circleMarker([city.lat, city.lng], {
        //         radius: parseInt(city.pop)/populationTotale * 100,
        //         ...circleOptions
        //     }).addTo(map);

        //     // Ajout d'un popup d'informations pour chaque cercle
        //     circle.bindPopup(`<b>${city.name}</b><br>Size of the population: ${city.pop}`);
        // }

        // Add markers with data to the map
        var marker1 = L.marker([-36.0737, 146.9135]).addTo(map).bindPopup("Albury");
        var marker2 = L.marker([-34.9285, 138.6007]).addTo(map).bindPopup("Adelaide");
        var marker3 = L.marker([-35.0031, 117.8657]).addTo(map).bindPopup("Albany");
        var marker4 = L.marker([-23.6980, 133.8807]).addTo(map).bindPopup("Alice Springs");

        // Attach click event listener to markers
        marker1.on('click', function () {
            updateDataInfo("Data for Marker 1");
            generateChart();
        });

        marker2.on('click', function () {
            updateDataInfo("Data for Marker 2");
            generateChart();
        });

        marker3.on('click', function () {
            updateDataInfo("Data for Marker 3");
            generateChart();
        });

        marker4.on('click', function () {
            updateDataInfo("Data for Marker 4");
            generateChart();
        });

        // Update data info in the dashboard
        function updateDataInfo(data) {
            document.getElementById('data-info').innerText = data;
        }

        // Generate random temperature data for the chart
        function generateRandomTempData() {
            var tempData = [];
            for (var i = 0; i < 7; i++) { // Generating data for 7 months
                tempData.push(Math.floor(Math.random() * 20) + 10); // Random temperature between 10 and 30
            }
            return tempData;
        }
        var chart;
        // Generate chart
        function generateChart() {
            var ctx = document.getElementById('chart').getContext('2d');
            var tempData = generateRandomTempData();
            // Détruire l'instance précédente du graphique s'il en existe une
            if (typeof chart !== 'undefined') {
                chart.destroy();
            }
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    datasets: [{
                        label: 'Temperature',
                        data: tempData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 40 // Set the maximum value on y-axis to 40
                        }
                    }
                }
            });
            var chartContainer = document.getElementById('chart').parentNode;
            chartContainer.style.width = chart.width + "px";
            chartContainer.style.height = chart.height + "px";

        }
     });
});