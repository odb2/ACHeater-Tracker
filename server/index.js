const path = require('path');
const weatherdata = require('../weatherdata.json')
const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

weatherdata_parsed = JSON.parse(JSON.stringify(weatherdata).replace(/\s(?=\w+":)/g, ""));

var result = {};
var result2 = {};
var heater_counter = 0;
var clock = 0;
var ac_counter = 0;

for(let i = 0; i < weatherdata_parsed.length-1; i++) {
    clock++
    if(clock == 24){
        result[weatherdata_parsed[i].Datetime.split(" ")[0]] = [heater_counter, ac_counter]
        result2[weatherdata_parsed[i].Datetime.split(" ")[0]] = ac_counter

        heater_counter = 0;
        ac_counter = 0;
        clock = 0;
    }
    if(weatherdata_parsed[i].MaximumTemperature >= 62 && weatherdata_parsed[i+1].MaximumTemperature < 62){
        heater_counter = heater_counter + 1
    } else if(weatherdata_parsed[i].MaximumTemperature <= 75 && weatherdata_parsed[i+1].MaximumTemperature > 75){
        ac_counter = ac_counter + 1
    }
};

// const test = result[0].getDate();
// console.log(weatherdata_parsed.length)
// console.log(weatherdata_parsed[0].Datetime.split(" ")[0])
// console.log(weatherdata_parsed[0].Datetime.split(" ")[1])
// console.log(weatherdata_parsed[0].MaximumTemperature)
// console.log(weatherdata_parsed[47])

// Handle GET requests to /api route
app.get("/weatherdata", (req, res) => {
    res.send(result);
});

// // Handle GET requests to /api route
// app.get("/?start=test", function(req, res) {
//     res.send(weatherdata_parsed);
// });

// Handle GET requests to /api route
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});


// app.get('', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });

// app.use(express.static(path.resolve(__dirname, '../client/build')));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});