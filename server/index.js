const path = require('path');
const express = require("express");
let alert = require('alert');
const moment = require('moment');
const XLSX = require('xlsx');
const weatherdata_csv = path.resolve(__dirname, '../history_data_hourly.csv')

const PORT = process.env.PORT || 3001;

const app = express();

/* 
Beginning part of index.js 
collects the history_data_hourly.csv file -> converts to JSON -> removes spaces in keys ->
creates new json file containing dates: [aconatleastonce (0 or 1), heatonatleastonce (0 or 1)]
-> Then once data is submitted it index through new json file to select dates in range
*/

let workbook = XLSX.readFile(weatherdata_csv, {raw:true});
// read first sheet (identified by first of SheetNames)
let sheet = workbook.Sheets[workbook.SheetNames[0]];
// convert to JSON
var weatherdata_parsed = XLSX.utils.sheet_to_json(sheet);

// Grabs weatherdata_parsed.json and removes the spaces in the keys
weatherdata_parsed = JSON.parse(JSON.stringify(weatherdata_parsed).replace(/\s(?=\w+":)/g, ""));

// Initialises two variables passdata and result to pass into other portions of project
var passdata = [];
var result = {};

// Following Script transforms the data to a json file with the date and whether the 
// ac or heater was turned on at least once (0 = not turned on at least once)
// (1 = turned on at least once)
var heater_counter = 0;
var ac_counter = 0;

// clock determines when to switch between dates (once clock hits 24, 0-23)
var clock = 0;

//Loop to go through every hour of data and seperate them to new json file named result
for(let i = 0; i < weatherdata_parsed.length-1; i++) {
    clock++
    if(clock == 24){
        result[weatherdata_parsed[i].Datetime.split(" ")[0]] =  [(heater_counter>0) ? 1 : 0, (ac_counter>0) ? 1 : 0]

        heater_counter = 0;
        ac_counter = 0;
        clock = 0;
    }
    if(weatherdata_parsed[i].Temperature >= 62 && weatherdata_parsed[i+1].Temperature < 62){
        heater_counter = heater_counter + 1
    } else if(weatherdata_parsed[i].Temperature <= 75 && weatherdata_parsed[i+1].Temperature > 75){
        ac_counter = ac_counter + 1
    }
};

// Handle GET requests to /api route
app.use(express.static(path.resolve(__dirname, '../client/build')));

// When submit form dates this gets called
app.get("/api/data", (req, res) => {

    var index_startdate = -1
    var index_enddate = -1
    var counter = 0;
    const dates_holder = [];
    var obj = {}

    //This loop finds the index of the startdata and enddate using new json data obtained above
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
    
    // case statements in case the startdate and enddate do not match what is required
    if(!moment(req.query.startdate,'MM/DD/YYYY',true).isValid()){
        alert("You must format start date and end date by MM/DD/YYYY, hit the back button on the browser to return");
        res.send({errormessage:'You must format start date and end date by MM/DD/YYYY, hit the back button on the browser to return'});
    } else if(!moment(req.query.enddate,'MM/DD/YYYY',true).isValid()){
        alert("You must format start date and end date by MM/DD/YYYY, hit the back button on the browser to return");
        res.send({errormessage:'You must format start date and end date by MM/DD/YYYY, hit the back button on the browser to return'});    
    }    
    else if(index_enddate == -1 && index_startdate == -1){
        alert("You must select a date range between 06/01/2020 and 07/30/2020, hit the back button on the browser to return");
        res.send({errormessage:'You must select a date range between 06/01/2020 and 07/30/2020, hit the back button on the browser to return'});
    } else if((index_enddate < index_startdate) && index_startdate > 0 && index_enddate > 0){
        alert("Your start date must be before your end date, hit the back button on the browser to return");
        res.send({errormessage:'Your start date must be before your end date, hit the back button on the browser to return'});
    } else {

        // case for if enddate is after dates allowed then return all the way to the last date
        if(index_enddate == -1){
            index_enddate = dates_holder.length
        } 
        // case for if startdate is before dates allowed then returns first date
        else if(index_startdate == -1){
            index_startdate = 0
        }
        
        //creates array filled with the date range
        var dates_holder_t = dates_holder.slice(index_startdate,index_enddate+1)

        //passesdata to display in reactjs
        passdata.push(dates_holder_t)
        
        var heater_holder = [];
        var ac_holder = [];

        //obtains whether the ac or heater was turned on at least once and
        // pushes them into array 
        for(let i = 0; i <= dates_holder_t.length-1; i++){
            heater_holder.push(result[dates_holder_t[i]][0]);
            ac_holder.push(result[dates_holder_t[i]][1]);
        }

        //passesdata to display in reactjs
        passdata.push(heater_holder)
        passdata.push(ac_holder)

        var sum = ac_holder.reduce((a,b) => a+b);
        var sum_2 = heater_holder.reduce((a,b) => a+b);
        var sum_total = sum + sum_2;

        //passesdata to display in reactjs
        passdata.push(sum_total)
        var heater_or_ac = []
        var heater_and_ac = []

        //finds amount of times the heater and/or were turned on and stores them in array
        for (const key of dates_holder_t){
            obj[key] = {"Heater":result[key][0],"AC":result[key][1]}
            heater_or_ac.push(((result[key][0]||result[key][1])==1 ? 1 : 0))
            heater_and_ac.push(((result[key][0]&&result[key][1])==1 ? 1 : 0))
        }
        passdata.push(heater_or_ac.reduce((a,b)=> a+b))
        passdata.push(heater_and_ac.reduce((a,b)=> a+b))
        res.send(obj);    
        }
});

// Handle GET requests to /api route
app.get("/showui", (req, res) => {
    res.send(passdata.slice(-6));
});;


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});