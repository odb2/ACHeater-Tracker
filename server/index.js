const path = require('path');
const weatherdata = require('../weatherdata.json')
const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

weatherdata_parsed = JSON.parse(JSON.stringify(weatherdata).replace(/\s(?=\w+":)/g, ""));

// Handle GET requests to /api route
app.get("/?start=test", function(req, res) {
    res.send(weatherdata_parsed);
});

// Handle GET requests to /api route
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

// Handle GET requests to /api route
app.get("/weatherdata", (req, res) => {
    res.send(weatherdata_parsed);
});

// app.get('', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });

// app.use(express.static(path.resolve(__dirname, '../client/build')));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});