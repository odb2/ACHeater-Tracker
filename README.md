# ACHeater-Tracker

## Table of Contents
* Project
* Installation
* How it Works
* Results
* Review Code/Documentation


## Project
Currently, the HVAC system is set such that the air-conditioning system is turned on when the outdoor temperature is over 75 degrees Fahrenheit. Similarly, the heating system is turned on when the outdoor temperature is under 62 degrees Fahrenheit. The engineering directors want to learn how often the air-conditioning and heating systems were turned on for July 2020. In particular, they would like a summary of data that provides the following:

* For each day in the given date range, indicate whether the air-conditioning
system was turned on at least once.
* For each day in the given date range, indicate whether the heating system was
turned on at least once.

Create a Restful API with the following specifications:
* Fetch data for a month indicated by the web report
* Transform data
* Return JSON formatted data
* (Optional) Present the results in a UI

## Installation

* Built using NodeJS and ExpressJS as the backend
* ReactJS used for the UI
* The project is deployed and live through Heroku located at this link https://acheater-reporter.herokuapp.com/

## How It Works

1. Download through git clone or visit https://acheater-reporter.herokuapp.com/
2. If downloaded through git clone start project by npm start
3. Start the software.

## Review Code/Documentation


    Excercise1
    ├── Client              #
    |    ├── build          # 
    |    ├── node_modules   #
    |    ├── public         #
    |    ├── src            #
    ├── node_modules            # 
    └── server                  #
        ├── benchmarks          # 
        

Following are functions and there descriptions

    private void Search_Button_Click(object sender, EventArgs e)

<ul>
<li>desc: Function to search google images based on title and content bold words and display the first image.</li>
<li>parameters: sender, event</li>
<li>returns: list urls which contains images found from search</li>
</ul>
