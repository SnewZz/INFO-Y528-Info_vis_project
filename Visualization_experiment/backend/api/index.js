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

app.get("/api/avgTemperature", (req, res) => {
    const year = req.query.year;
    const season = req.query.season;
    const content = fs.readFileSync(path.join(__dirname, "../static/data/data_map.csv"));
    var filteredData;

    csv.parse(content, {}, (err, records) => {

        //Filter the data on the year
        
        filteredData = records.filter(function (d) {
            return d[4].split("-")[0] === year && d[5] === season;
        });

        //Calculate avg temperature per region
        var regionsAvgTemp = [];
        regions.REGIONS.forEach(item => {
            var totalTemp = 0;
            var nbElts = 0;
            filteredData.forEach(data => {
                if (data[10].localeCompare(item)) {
                    totalTemp += parseFloat(data[8]);
                    nbElts++;
                }
            });
            regionsAvgTemp.push({ name: item, avgTemperature: totalTemp / nbElts });
        });
        res.status(200).send(regionsAvgTemp);
    });
});

app.listen(port, () => {
    console.log("App is started on ", port);
})
