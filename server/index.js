const path = require('path');
const weatherdata = require('../weatherdata.json')
const express = require("express");
const { query } = require('express');

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

// Handle GET requests to /api route
app.use(express.static(path.resolve(__dirname, '../client/build')));

var passdata = [];

app.get("/api/data", (req, res) => {
    var index_startdate = 0
    var index_enddate = 0
    var counter = 0;
    const dates_holder = [];
    var obj = {}
    for (var a in result){
        dates_holder.push(a)
        if(a === req.query.startdate){
            index_startdate = counter
        }
        if(a === req.query.enddate){
            index_enddate = counter
        }
        counter++
    }
    var dates_holder_t = dates_holder.slice(index_startdate,index_enddate+1)
    passdata.push(dates_holder_t)

    
    const dates_counter = [];
    for (var i = 0; i < dates_holder_t.length; i++){
        dates_counter.push(result[dates_holder_t[i]])
    }

    var heater_holder = [];
    var ac_holder = [];
    for(let i = 0; i <= dates_holder_t.length-1; i++){
        heater_holder.push(result[dates_holder_t[i]][0]);
        ac_holder.push(result[dates_holder_t[i]][1]);
    }

    passdata.push(heater_holder)
    passdata.push(ac_holder)

    var sum = ac_holder.reduce((a,b) => a+b);
    var sum_2 = heater_holder.reduce((a,b) => a+b);
    var sum_total = sum + sum_2;

    passdata.push(sum_total)

    for (const key of dates_holder_t){
        obj[key] = {"Heater":result[key][0],"AC":result[key][1]}
    }
    res.send(obj);
});

// Handle GET requests to /api route
app.get("/showui", (req, res) => {
    res.send(passdata.slice(-4));
});;


// Handle GET requests to /api route
app.get("/weatherdata", (req, res) => {
    res.send(result);
});;

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});