import React, { Component } from 'react';
import axios from "axios";

class Weather extends Component {
    constructor(){
        super()
        this.state = {
            weather: "Not yet gotten",
            data: "",
            startdate:''
            enddate:''
        }
    }
    handleButtonClick = () => {
        axios.get("/weatherdata").then(response => {
            console.log(response.data[0]);
            this.setState({
                weather: response.data[0].Temperature,
                data: response.data
            });
            console.log(this.state.data);

        });
    };

    handlestartdateOnChange(e) {
        this.setState({
          name: e.target.value
        });
        console.log(this.state.name);
      }
    handleenddateOnChange(e) {
        this.setState({
          name: e.target.value
        });
        console.log(this.state.name);
      }

    render() {
        return (
            <div>
                <div>
                    <label>Add Start Date:</label>
                    <input type="text" id="name" value={this.state.name} onChange={ (e) => this.handleNameOnChange(e) } />
                    <input type="text" id="name" value={this.state.name} onChange={ (e) => this.handleNameOnChange(e) } />
                    <input type="button" id="name" onClick=""/>
                </div>
                <button onClick={this.handleButtonClick}>Click me for data in console!</button>
                <h1> The Weather in month is: {this.state.weather}</h1>
            </div>
        );
    }
}

export default Weather;