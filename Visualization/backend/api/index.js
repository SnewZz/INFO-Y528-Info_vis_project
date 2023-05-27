

const csv = require("csv");
const fs = require("fs");
const express = require("express");
const path = require("path");
const regions = require(path.join(__dirname, "../utils/regions.util.js"));
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/templates/index.html"));
})

app.use(express.static(path.join(__dirname, "../../frontend/static")));

app.get("/api/regionsGeoJSON", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    fs.createReadStream(path.join(__dirname, "../static/geoJSON/local-government-area.geojson")).pipe(res);
});

app.get("/api/citiesInRegion",(req,res) => {
    const region = req.query.region; //Get the name of the region
    const content = fs.readFileSync(path.join(__dirname, "../static/data/CoordCities.csv"));
    var filteredData;

    csv.parse(content,{},(err,records) => {
        filteredData = records.filter(function (d) {
            return d[6] === region;
        });
        res.status(200).send(filteredData);
    })
})

app.get("/api/RainByMonth",(req,res) => {
    const year = req.query.year; //Get the year
    const city = req.query.city; //Get the city
    const content = fs.readFileSync(path.join(__dirname, "../static/data/Datamap_2.csv"));
    var filteredData;
    rain_val = []

    csv.parse(content,{},(err,records) => {
        filteredData = records.filter(function (d) {
            return d[2] === city && d[4].split("-")[0] === year;
        });

        for (i = 0; i < filteredData.length; i++){
            rain_val.push(filteredData[i][5])
        }

        res.status(200).send(rain_val);
    })
})


app.get("/api/TminByMonth",(req,res) => {
    const year = req.query.year; //Get the year
    const city = req.query.city; //Get the city
    const content = fs.readFileSync(path.join(__dirname, "../static/data/Datamap_2.csv"));
    var filteredData;
    t_min_val = []

    csv.parse(content,{},(err,records) => {
        filteredData = records.filter(function (d) {
            return d[2] === city && d[4].split("-")[0] === year;
        });
        for (i = 0; i < filteredData.length; i++){
            t_min_val.push(filteredData[i][6])
        }

        res.status(200).send(t_min_val);
    })
})

app.get("/api/TmaxByMonth",(req,res) => {
    const year = req.query.year; //Get the year
    const city = req.query.city; //Get the city
    const content = fs.readFileSync(path.join(__dirname, "../static/data/Datamap_2.csv"));
    var filteredData;
    t_max_val = []

    csv.parse(content,{},(err,records) => {
        filteredData = records.filter(function (d) {
            return d[2] === city && d[4].split("-")[0] === year;
        });

        for (i = 0; i < filteredData.length; i++){
            t_max_val.push(filteredData[i][7])
        }

        res.status(200).send(t_max_val);
    })
})

app.get("/api/SunByMonth",(req,res) => {
    const year = req.query.year; //Get the year
    const city = req.query.city; //Get the city
    const content = fs.readFileSync(path.join(__dirname, "../static/data/Datamap_2.csv"));
    var filteredData;
    sun_val = []

    csv.parse(content,{},(err,records) => {
        filteredData = records.filter(function (d) {
            return d[2] === city && d[4].split("-")[0] === year;
        });

        for (i = 0; i < filteredData.length; i++){
            sun_val.push(filteredData[i][8])
        }

        res.status(200).send(sun_val);
    })
})

app.get("/api/coordinateCities",(req,res) => {
    const city = req.query.city;
    const content = fs.readFileSync(path.join(__dirname, "../static/data/CoordCities.csv"));
    const coordinate = [];
    var filteredData; 

    csv.parse(content, {}, (err, records) => {
        filteredData = records.filter(function (d) {
            return d[2] === city;
        });
        coordinate.push(filteredData[0][3]);
        coordinate.push(filteredData[0][4]);

        res.status(200).send(coordinate);
    });
});


    

app.get("/api/rainiestCities", (req, res) => {
    const year = req.query.year;
    const season = req.query.season;
    const content = fs.readFileSync(path.join(__dirname, "../static/data/data_map.csv"));
    var filteredData;

    csv.parse(content, {}, (err, records) => {
        
        //Filter the data on the year and season
        filteredData = records.filter(function (d) {
            return d[4].split("-")[0] === year && d[5] === season;
        });

        const cities = [];

        filteredData.forEach(item => {
            if(item[6] != "NaN"){
                const city = {
                    id : item[1],
                    name : item[2],
                    rainLvl : item[6].substring(0,6)
                }
                cities.push(city);
            }
        });

        cities.sort((a, b) => b.rainLvl - a.rainLvl);
        const top3Rainiest = cities.slice(0, 3);
        res.status(200).send(top3Rainiest);
    });
});

app.get("/api/driestCities", (req, res) => {
    const year = req.query.year;
    const season = req.query.season;
    const content = fs.readFileSync(path.join(__dirname, "../static/data/data_map.csv"));
    var filteredData;

    csv.parse(content, {}, (err, records) => {
        //Filter the data on the year and season

        filteredData = records.filter(function (d) {
            return d[4].split("-")[0] === year && d[5] === season;
        });

        const cities = [];

        filteredData.forEach(item => {
            if (item[6] != "NaN") {
                const city = {
                    id: item[1],
                    name: item[2],
                    rainLvl: item[6].substring(0, 6)
                }
                cities.push(city);
            }
        });

        cities.sort((a, b) => a.rainLvl - b.rainLvl);
        const top3Rainiest = cities.slice(0, 3);
        res.status(200).send(top3Rainiest);
    });
});

app.get("/api/suniestCities", (req, res) => {
    const year = req.query.year;
    const season = req.query.season;
    const content = fs.readFileSync(path.join(__dirname, "../static/data/data_map.csv"));
    var filteredData;

    csv.parse(content, {}, (err, records) => {

        //Filter the data on the year and season

        filteredData = records.filter(function (d) {
            return d[4].split("-")[0] === year && d[5] === season;
        });

        const cities = [];

        filteredData.forEach(item => {
            if(item[9] != "NaN"){
                const city = {
                    id : item[1],
                    name : item[2],
                    sunLvl : item[9].substring(0,6)
                }
                cities.push(city);
            }
        });

        cities.sort((a, b) => b.sunLvl - a.sunLvl);
        const top3Suniest = cities.slice(0, 3);
        res.status(200).send(top3Suniest);
    });
});


app.get("/api/leastSunnyCities", (req, res) => {
    const year = req.query.year;
    const season = req.query.season;
    const content = fs.readFileSync(path.join(__dirname, "../static/data/data_map.csv"));
    var filteredData;

    csv.parse(content, {}, (err, records) => {

        //Filter the data on the year and season

        filteredData = records.filter(function (d) {
            return d[4].split("-")[0] === year && d[5] === season;
        });

        const cities = [];

        filteredData.forEach(item => {
            if (item[9] != "NaN") {
                const city = {
                    id: item[1],
                    name: item[2],
                    sunLvl: item[9].substring(0, 6)
                }
                cities.push(city);
            }
        });

        cities.sort((a, b) => a.sunLvl - b.sunLvl);
        const top3Suniest = cities.slice(0, 3);
        res.status(200).send(top3Suniest);
    });
});


app.get("/api/hottestCities", (req, res) => {
    const year = req.query.year;
    const season = req.query.season;
    const content = fs.readFileSync(path.join(__dirname, "../static/data/data_map.csv"));
    var filteredData;

    csv.parse(content, {}, (err, records) => {

        //Filter the data on the year and season

        filteredData = records.filter(function (d) {
            return d[4].split("-")[0] === year && d[5] === season;
        });

        const cities = [];

        filteredData.forEach(item => {
            if(item[8] != "NaN"){
                const city = {
                    id : item[1],
                    name : item[2],
                    temp : item[8].substring(0,6)
                }
                cities.push(city);
            }
        });

        cities.sort((a, b) => b.temp - a.temp);
        const top3Hottest = cities.slice(0, 3);
        res.status(200).send(top3Hottest);
    });
});

app.get("/api/coldestCities", (req, res) => {
    const year = req.query.year;
    const season = req.query.season;
    const content = fs.readFileSync(path.join(__dirname, "../static/data/data_map.csv"));
    var filteredData;

    csv.parse(content, {}, (err, records) => {

        //Filter the data on the year and season

        filteredData = records.filter(function (d) {
            return d[4].split("-")[0] === year && d[5] === season;
        });

        const cities = [];

        filteredData.forEach(item => {
            if(item[8] != "NaN"){
                const city = {
                    id : item[1],
                    name : item[2],
                    temp : item[7].substring(0,6)
                }
                cities.push(city);
            }
        });

        cities.sort((a, b) => a.temp - b.temp);
        const top3Coldest = cities.slice(0, 3);
        res.status(200).send(top3Coldest);
    });
});

app.get("/api/avgRain", (req, res) => {
    const year = req.query.year;
    const season = req.query.season;
    const content = fs.readFileSync(path.join(__dirname, "../static/data/data_map.csv"));
    var filteredData;

    csv.parse(content, {}, (err, records) => {

        //Filter the data on the year and season

        filteredData = records.filter(function (d) {
            return d[4].split("-")[0] === year && d[5] === season;
        });

        //Calculate avg temperature per region
        var regionsAvgRain = [];
        regions.REGIONS.forEach(item => {
            var totalRain = 0;
            var nbElts = 0;
            filteredData.forEach(data => {
                if (data[11].localeCompare(item) == 0) {
                    if (data[6] != "NaN") {
                        totalRain += parseFloat(data[6]);
                        nbElts++;
                    }
                }
            });
            regionsAvgRain.push({ name: item, avgData: totalRain / nbElts });
        });
        res.status(200).send(regionsAvgRain);
    });
});

app.get("/api/avgSunshine", (req, res) => {
    const year = req.query.year;
    const season = req.query.season;
    const content = fs.readFileSync(path.join(__dirname, "../static/data/data_map.csv"));
    var filteredData;

    csv.parse(content, {}, (err, records) => {

        //Filter the data on the year and season

        filteredData = records.filter(function (d) {
            return d[4].split("-")[0] === year && d[5] === season;
        });

        //Calculate avg temperature per region
        var regionsAvgSunshine = [];
        regions.REGIONS.forEach(item => {
            var totalSunshine = 0;
            var nbElts = 0;
            filteredData.forEach(data => {
                if (data[11].localeCompare(item) == 0) {
                    if (data[9] != "NaN" && data[9] != "0.0") {
                        totalSunshine += parseFloat(data[9]);
                        nbElts++;
                    }
                }
            });
            regionsAvgSunshine.push({ name: item, avgData: totalSunshine / nbElts });
        });
        res.status(200).send(regionsAvgSunshine);
    });
});

app.get("/api/avgHighestTemperature", (req, res) => {
    const year = req.query.year;
    const season = req.query.season;
    const content = fs.readFileSync(path.join(__dirname, "../static/data/data_map.csv"));
    var filteredData;

    csv.parse(content, {}, (err, records) => {

        //Filter the data on the year and season

        filteredData = records.filter(function (d) {
            return d[4].split("-")[0] === year && d[5] === season;
        });

        //Calculate avg temperature per region
        var regionsAvgTemp = [];
        regions.REGIONS.forEach(item => {
            var totalTemp = 0;
            var nbElts = 0;
            filteredData.forEach(data => {
                if (data[11].localeCompare(item) == 0) {
                    if (data[8] != "NaN") {
                        totalTemp += parseFloat(data[8]);
                        nbElts++;
                    }
                }
            });
            regionsAvgTemp.push({ name: item, avgData: totalTemp / nbElts });
        });
        res.status(200).send(regionsAvgTemp);
    });
});

app.get("/api/avgLowestTemperature", (req, res) => {
    const year = req.query.year;
    const season = req.query.season;
    const content = fs.readFileSync(path.join(__dirname, "../static/data/data_map.csv"));
    var filteredData;

    csv.parse(content, {}, (err, records) => {

        //Filter the data on the year and season

        filteredData = records.filter(function (d) {
            return d[4].split("-")[0] === year && d[5] === season;
        });

        //Calculate avg temperature per region
        var regionsAvgTemp = [];
        regions.REGIONS.forEach(item => {
            var totalTemp = 0;
            var nbElts = 0;
            filteredData.forEach(data => {
                if (data[11].localeCompare(item) == 0) {
                    if (data[7] != "NaN") {
                        totalTemp += parseFloat(data[7]);
                        nbElts++;
                    }
                }
            });
            regionsAvgTemp.push({ name: item, avgData: totalTemp / nbElts });
        });
        res.status(200).send(regionsAvgTemp);
    });
});

app.get("/api/cityInformation", (req, res) => {
    const year = req.query.year;
    const season = req.query.season;
    const cityName = req.query.cityName;
    const content = fs.readFileSync(path.join(__dirname, "../static/data/data_map.csv"));
    var filteredData;

    csv.parse(content, {}, (err, records) => {

        //Filter data on cityName, the year and season

        filteredData = records.filter(function (d) {
            return d[2] === cityName && d[4].split("-")[0] === year && d[5] === season;
        });
        res.status(200).send({name: filteredData[0][2], highestTemp: filteredData[0][8], lowestTemp: filteredData[0][7], rain: filteredData[0][6], sun: filteredData[0][9]});
    });
});

app.listen(port, () => {
    console.log("App is started on ", port);
})