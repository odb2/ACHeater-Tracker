import React, { Component } from 'react';
import axios from "axios";

class Weather extends Component {
    constructor(){
        super()
        this.state = {
            startdate: "",
            enddate: "",
            ac_holder_final: [0,0],
            heater_holder_final: [0,0],
            dates_holder_final: ["06/01/2020", "06/02/2020"],
            sum_betweendates: 0,
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
          startdate: e.target.value
        });
      };

    handleenddateOnChange(e) {
        this.setState({
          enddate: e.target.value
        });
      };


    render() {
        return (
            <div>
                <div>
                    <form action="/api/data">
                        <label>Add Start Date:</label>
                        <input type="text" name="startdate" value={this.state.startdate} onChange={ (e) => this.handlestartdateOnChange(e) }/>
                        <label>Add End Date:</label>
                        <input type="text" name="enddate" value={this.state.enddate} onChange={ (e) => this.handleenddateOnChange(e) } />
                        <button type="submit" onClick={this.handleButtonClick()}>Output Json File</button>
                    </form>
                </div>
                <button onClick={this.ToggleUI}>Show UI</button>
                <div id="UI_Display" style={{ display: (this.state.showing ? 'none' : 'block') }}>
                    <h2> The amount of times the heater/AC was turned on between {this.state.startdate} and {this.state.enddate} was: {this.state.sum_betweendates} times</h2>
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