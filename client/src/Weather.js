import React, { Component } from 'react';
import axios from "axios";

class Weather extends Component {
    constructor(){
        super()
        this.state = {
            weather: 0,
            weather2: 0,
            data: "",
            startdate: "06/01/2020",
            enddate: "06/02/2020"
        }
    }
    handleButtonClick = () => {
        axios.get("/weatherdata").then(response => {
            console.log(response);
            this.setState({
                weather: response.data[this.state.startdate][0],
                weather2: response.data[this.state.startdate][1],
                data: response.data
            });
            console.log(this.state.data);
            console.log(this.state.weather);
        });
    };

    handlestartdateOnChange(e) {
        this.setState({
          startdate: e.target.value
        });
        console.log(this.state.startdate);
      }

    handleenddateOnChange(e) {
        this.setState({
          enddate: e.target.value
        });
        console.log(this.state.enddate);
      }

    render() {
        return (
            <div>
                <div>
                    <label>Add Start Date:</label>
                    <input type="text" id="startdate" value={this.state.startdate} onChange={ (e) => this.handlestartdateOnChange(e) } />
                    <input type="text" id="enddate" value={this.state.enddate} onChange={ (e) => this.handleenddateOnChange(e) } />
                    <input type="button" id="name2"/>
                </div>
                <button onClick={this.handleButtonClick}>Click me for data in console!</button>
                <h1> The amount of times the heater/AC was turned on between {this.state.startdate} and {this.state.enddate} was: {this.state.weather+this.state.weather2}</h1>
            </div>
        );
    }
}

export default Weather;