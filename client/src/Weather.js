import React, { Component } from 'react';
import axios from "axios";

class Weather extends Component {
    constructor(){
        super()
        this.state = {
            sdateheater: 0,
            sdateac: 0,
            edateheater: 0,
            edateac: 0,
            data: '',
            startdate: "06/01/2020",
            enddate: "06/02/2020",
            amount_heater: 0,
            amount_ac: 0,
            ac_holder_final: [0,0],
            heater_holder_final: [0,0],
            dates_holder_final: ["06/01/2020", "06/02/2020"],
            sum_betweendates: 0
        }
    }

    handleButtonClick = () => {
        axios.get("/weatherdata").then(response => {
            this.setState({
                sdateheater: response.data[this.state.startdate][0],
                sdateac: response.data[this.state.startdate][1],
                edateheater: response.data[this.state.enddate][0],
                edateac: response.data[this.state.enddate][1],
                data: response.data,
            });
            var index_startdate = 0
            var index_enddate = 0
            var counter = 0;   
    
            const dates_holder = [];
            for (var a in this.state.data){
                dates_holder.push(a)
                if(a == this.state.startdate){
                    index_startdate = counter
                }
                if(a == this.state.enddate){
                    index_enddate = counter
                }
                counter++
            }
            var dates_holder_t = dates_holder.slice(index_startdate,index_enddate+1)
            this.setState({
                dates_holder_final: dates_holder_t
            });

            var heater_holder = [];
            var ac_holder = [];
            for(let i = 0; i <= this.state.dates_holder_final.length-1; i++){
                heater_holder.push(response.data[this.state.dates_holder_final[i]][0]);
                ac_holder.push(response.data[this.state.dates_holder_final[i]][1]);
            }

            var sum = ac_holder.reduce((a,b) => a+b);
            var sum_2 = heater_holder.reduce((a,b) => a+b);
            var sum_total = sum + sum_2;

            this.setState({
                ac_holder_final: ac_holder,
                heater_holder_final: heater_holder,
                sum_betweendates: sum_total
            });
        });
        console.log(this.state.heater_holder_final)
        console.log(this.state.ac_holder_final)
        console.log(this.state.dates_holder_final)
    };

    onClickwrapper = () => {
        this.handleButtonClick();
    }

    handlestartdateOnChange(e) {
        this.setState({
          startdate: e.target.value
        });
      }

    handleenddateOnChange(e) {
        this.setState({
          enddate: e.target.value
        });
      }

    render() {
        return (
            <div>
                <div>
                    <label>Add Start Date:</label>
                    <input type="text" id="startdate" value={this.state.startdate} onChange={ (e) => this.handlestartdateOnChange(e) } />
                    <label>Add End Date:</label>
                    <input type="text" id="enddate" value={this.state.enddate} onChange={ (e) => this.handleenddateOnChange(e) } />
                </div>
                <button onClick={this.onClickwrapper}>Click me for data in console!</button>
                <h2> The amount of times the heater/AC was turned on between {this.state.startdate} and {this.state.enddate} was: {this.state.sum_betweendates} times</h2>
                <ul>
                    {this.state.dates_holder_final.map((item,i) => {
                   return <li key={i}>Date: {item}
                        <ul>
                            <li>AC: {this.state.ac_holder_final[i]}</li>
                            <li>Heater: {this.state.heater_holder_final[i]}</li>

                            {/* {this.state.ac_holder_final.map((itemchild,childi) => {
                            return <li id={childi}>AC: {itemchild}</li>
                            })}
                            {this.state.heater_holder_final.map((itemchild,childi) => {
                            return <li id={childi}>Heater: {itemchild}</li>
                            })} */}
                        </ul>
                    </li> 
                    })}
                </ul>
                {/* <ul>
                    {this.state.ac_holder_final.map(function(item,i){
                        return <li key={i}>AC:{item}</li>
                    })}
                </ul>
                <ul>
                    {this.state.heater_holder_final.map(function(item,i){
                        return <li key={i}>Heater:{item}</li>
                    })}
                </ul> */}
            </div>
        );
    }
}

export default Weather;