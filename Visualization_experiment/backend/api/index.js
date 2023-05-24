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
    // const content = fs.readFileSync(path.join(__dirname, "../static/geoJSON/local-government-area.geojson"));
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
});


//--------------------------------------------
// CHART ---------------
//--------------------------------------------

app.get("/api/seasonchart", (req, res) => {
    const city = req.query.city;
    const year = req.query.year;
    const season = req.query.season;
    // console.log("X01");
    // console.log(region);
    // const season = req.query.season;
    const content = fs.readFileSync(path.join(__dirname, "../static/data/data_map.csv"));
    var filteredData;

    csv.parse(content, {}, (err, records) => {
        //Filter the data on the year and season
        filteredData = records.filter(function (d) {
            return d[2] === city;
        });
        const cities = [];

        filteredData.forEach(item => {
            if(item[6] != "NaN"){
                const city = {
                    id : item[1],
                    name : item[2],
                    startDat: item[3],
                    season: item[5],
                    rainLvl : item[6].substring(0,6),
                    temp_min : item[7],
                    temp_max : item[8],
                    sunshine : item[9]
                }
                cities.push(city);
            }
        });

        res.status(200).send(cities);
    });
});

app.get("/api/monthschart", (req, res) => {
    const city = req.query.city;
    const year = req.query.year;
    const season = req.query.season;
    // console.log("X01");
    // console.log(region);
    // const season = req.query.season;
    const content = fs.readFileSync(path.join(__dirname, "../static/data/Datamap_2.csv"));
    var filteredData;

    csv.parse(content, {}, (err, records) => {
        //Filter the data on the year and season
        filteredData = records.filter(function (d) {
            return d[2] === city;
        });
        const cities = [];

        filteredData.forEach(item => {
            if(item[6] != "NaN"){
                const city = {
                    id : item[1],
                    name : item[2],
                    startDat: item[3],
                    year: item[3].substring(0,4),
                    month: item[3].substring(5,7),
                    season: item[5],
                    rainLvl : item[6].substring(0,6),
                    temp_min : item[7],
                    temp_max : item[8],
                    sunshine : item[9]
                }
                cities.push(city);
            }
        });

        res.status(200).send(cities);
    });
});

app.get("/api/coordinateCities",(req,res) => {
    const city = req.query.city;
    const content = fs.readFileSync(path.join(__dirname, "../static/data/CoordCities.csv"));
    const coordinate = [];
    var filteredData; 

    //console.log(city)
    csv.parse(content, {}, (err, records) => {
        filteredData = records.filter(function (d) {
            //console.log(d[2]);
            return d[2] === city;
        });
        //console.log(filteredData)
        coordinate.push(filteredData[0][3]);
        coordinate.push(filteredData[0][4]);

        res.status(200).send(coordinate);
        //return data
    });
});
    

app.get("/api/rainiestCities", (req, res) => {
    const year = req.query.year;
    const season = req.query.season;
    const content = fs.readFileSync(path.join(__dirname, "../static/data/data_map.csv"));
    var filteredData;

    csv.parse(content, {}, (err, records) => {
        //console.log("Hello")
        //Filter the data on the year and season

        filteredData = records.filter(function (d) {
            return d[4].split("-")[0] === year && d[5] === season;
        });

        // console.log(filteredData)

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
                    temp : item[8].substring(0,6)
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
                if (data[11].localeCompare(item)) {
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
                if (data[11].localeCompare(item)) {
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
                if (data[11].localeCompare(item)) {
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
                if (data[11].localeCompare(item)) {
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

app.listen(port, () => {
    console.log("App is started on ", port);
})