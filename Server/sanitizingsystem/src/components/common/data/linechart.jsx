import React, { useEffect, useState } from "react";
import {  Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import './data.css'


// //!! To fix the issue of having to read several collections, lets make one jsx file dedicated to the line chart
// //!! It has all the code needed to read it in the JSON format then we can call it in the html portion below
// let totalSanitizations = 0;

// //https://www.psu.edu/news/campus-life/story/think-twice-grabbing-door-knob/
// let germsKilled = 0;

export let ldata = [
    {
        day: "Sun",
        sanitizations: null
    },
    {
        day: "Mon",
        sanitizations: null
    },
    {
        day: "Tues",
        sanitizations: null
    },
    {
        day: "Wed",
        sanitizations: null
    },
    {
        day: "Thurs",
        sanitizations: null
    },
    {
        day: "Fri",
        sanitizations: null
    },
    {
        day: "Sat",
        sanitizations: null
    }
];


export const LineCharts = (props) => { 

  ldata[0].sanitizations  = props.dayoWeek.Sunday;
  ldata[1].sanitizations  = props.dayoWeek.Monday;
  ldata[2].sanitizations  = props.dayoWeek.Tuesday;
  ldata[3].sanitizations  = props.dayoWeek.Wednesday;
  ldata[4].sanitizations  = props.dayoWeek.Thursday;
  ldata[5].sanitizations  = props.dayoWeek.Friday;
  ldata[6].sanitizations  = props.dayoWeek.Saturday;


  // for (const day of ldata)
  // {
  // totalSanitizations += day.sanitizations;
  // }
  // germsKilled = totalSanitizations * ((1 * 10)**6); //10^6 power

  return true;
};



export function LineChartData() {  

    //get data from the database
    const [wk, setwk] = useState([]);
  
    useEffect(() => {
          async function getLineData() 
          {
            //gets the data from the database at the localhost specified
            const weekDater = await fetch(`http://localhost:2000/weekdata/`);
  
              //if there is no response then give this message
              if (!weekDater.ok) 
              {
                  const msg = `An error occurred: ${weekDater.statusText}`;
                  window.alert(msg);
                  return;
              }
  
              //stat = the fetched data in json format
              const wk = await weekDater.json();

              setwk(wk);              
            }
            getLineData();
    }, [wk.length, ]);
  
    function getter () {
      return wk.map( (dater) => {
              return (<LineCharts key={wk._id} dayoWeek={dater}/>);   
        })}
  
    return (
      <section>
        {getter()}
        
        <section>
            <div id="line">
              <LineChart width={440} height={340} data={ldata} margin={{top: 40, right: 0, left: 0, bottom: 0}}>
              <CartesianGrid stroke="#ccc" strokeDasharray="1 1"  />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sanitizations" stroke="#5E9A50" activeDot={{ r: 10 }}/>
              </LineChart>
              {/* <div id="fontss">
                <h1>Weekly Sanitizations: &ensp; {totalSanitizations} </h1>
                <h1> Weekly Germs Killed: &ensp; {germsKilled}</h1>
              </div> */}
            </div>
        </section>
      </section>
    );
  }
  