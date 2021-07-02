import React, { Component } from 'react';
import axios from "axios";

class Weather extends Component {
    constructor(){
        super()
        this.state = {
            startvalue: '',
            endvalue: '',
            startdate: '',
            enddate: '',
            ac_holder_final: [],
            heater_holder_final: [],
            dates_holder_final: [],
            sum_betweendates: 0,
            heater_or_ac: 0,
            heater_and_ac: 0,
            showing: true
        }
    }

    apifunc = () => {
        axios.get("/api/data").then(response => {
            console.log(response)
        });
    };

    handleButtonClick = () => {
        axios.get("/showui").then(response => {
            this.setState({
                heater_holder_final: response.data[1],
                ac_holder_final: response.data[2],
                dates_holder_final: response.data[0],
                sum_betweendates: response.data[3],
                startdate: response.data[0][0],
                enddate: response.data[0].slice(-1),
                heater_or_ac: response.data[4],
                heater_and_ac: response.data[5]
            });
        });
    }

    ToggleUI = () => {
        this.setState(showing=>({
            showing: !showing
        }))    
    };

    handlestartdateOnChange(e) {
        this.setState({
          startvalue: e.target.value
        });
      };

    handleenddateOnChange(e) {
        this.setState({
          endvalue: e.target.value
        });
      };


    render() {
        return (
            <div>
                <div>
                    <form action="/api/data">
                        <label>Add Start Date:</label>
                        <input type="text" name="startdate" value={this.state.startvalue} onChange={ (e) => this.handlestartdateOnChange(e) }/>
                        <label>Add End Date:</label>
                        <input type="text" name="enddate" value={this.state.endvalue} onChange={ (e) => this.handleenddateOnChange(e) } />
                        <button type="submit" onClick={this.handleButtonClick()}>Output Json File</button>
                    </form>
                </div>
                <button onClick={this.ToggleUI}>Show UI</button>
                <div id="UI_Display" style={{ display: (this.state.showing ? 'none' : 'block') }}>
                    <h3> Number of days the heater or AC was turned on between {this.state.startdate} and {this.state.enddate} was: {this.state.heater_or_ac} days</h3>
                    <h3> Number of days the heater and AC was turned on between {this.state.startdate} and {this.state.enddate} was: {this.state.heater_and_ac} days</h3>
                    <ul>
                        {this.state.dates_holder_final.map((item,i) => {
                    return <li id={i}>Date: {item}
                            <ul>
                                <li>AC: {this.state.ac_holder_final[i]}</li>
                                <li>Heater: {this.state.heater_holder_final[i]}</li>
                            </ul>
                        </li> 
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Weather;