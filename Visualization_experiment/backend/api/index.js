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

app.use(express.static(path.join(__dirname,"../../frontend/static")));

app.get("/api/regionsGeoJSON", (req, res) =>{
    // const content = fs.readFileSync(path.join(__dirname, "../static/geoJSON/local-government-area.geojson"));
    res.setHeader('Content-Type', 'application/json');
    fs.createReadStream(path.join(__dirname, "../static/geoJSON/local-government-area.geojson")).pipe(res);
})

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
                    if(data[6]!="NaN"){
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
                    if(data[9]!="NaN" && data[9]!="0.0"){
                        totalSunshine += parseFloat(data[9]);
                        nbElts++;
                    }
                }
            });
            console.log(totalSunshine/nbElts)
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
                    if(data[8]!="NaN"){
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
                    if(data[7]!="NaN"){
                        totalTemp += parseFloat(data[7]);
                        nbElts++;
                    }
                }
            });
            console.log(totalTemp/nbElts)
            regionsAvgTemp.push({ name: item, avgData: totalTemp / nbElts });
        });
        res.status(200).send(regionsAvgTemp);
    });
});

app.listen(port, () => {
    console.log("App is started on ", port);
})