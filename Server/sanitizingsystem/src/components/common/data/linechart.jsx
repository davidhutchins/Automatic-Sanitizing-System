import React, { useEffect, useState } from "react";
import {  Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import './data.css'
//import database from  '../../../server/database/connector'
export let weeklyTotal;
export let ldata = [
    {
      day: "Sun",
      Sanitizations: 0
    },
    {
        day: "Mon",
        Sanitizations: 0
    },
    {
        day: "Tues",
        Sanitizations: 0
    },
    {
        day: "Wed",
        Sanitizations: 0
    },
    {
        day: "Thurs",
        Sanitizations: 0
    },
    {
        day: "Fri",
        Sanitizations: 0
    },
    {
        day: "Sat",
        Sanitizations: 0
    }
];

export function LineChartData() {  

    // //get data from the database
    // const [wk, setwk] = useState([]);
  
    useEffect(() => {
          async function getLineData() 
          {
            //gets the data from the database at the localhost specified
            //const weekDater = await fetch(`http://54.90.139.97/api/weekdata?handleId=30`);
            //TODO: Make the handleID user specific
            const weekDater = await fetch(`http://localhost:2000/handleData?deviceId=30`);
  
              //if there is no response then give this message
              if (!weekDater.ok) 
              {
                  const msg = `An error occurred: ${weekDater.statusText}`;
                  window.alert(msg);
                  return;
              }
  
              //stat = the fetched data in json format
              const getWeekData = await weekDater.json();
              console.log(getWeekData);

              //Load the data from JSON into array to display on line chart
              ldata[0].Sanitizations = getWeekData[0].Sunday;
              ldata[1].Sanitizations = getWeekData[0].Monday;
              ldata[2].Sanitizations = getWeekData[0].Tuesday;
              ldata[3].Sanitizations = getWeekData[0].Wednesday;
              ldata[4].Sanitizations = getWeekData[0].Thursday;
              ldata[5].Sanitizations = getWeekData[0].Friday;
              ldata[6].Sanitizations = getWeekData[0].Saturday;
                
              weeklyTotal = getWeekData[0].Sunday + 
                  getWeekData[0].Monday + 
                  getWeekData[0].Tuesday + 
                  getWeekData[0].Wednesday + 
                  getWeekData[0].Thursday + 
                  getWeekData[0].Friday + 
                  getWeekData[0].Saturday;

              // setwk(ldata);
            }
            getLineData();
            // console.log(wk)
    }, []);
    
    return (
      <section>
        
        <section>
            <div id="line">
              <LineChart width={440} height={340} data={ldata} margin={{top: 40, right: 0, left: 0, bottom: 0}}>
              <CartesianGrid stroke="#ccc" strokeDasharray="1 1"  />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Sanitizations" stroke="#5E9A50" activeDot={{ r: 10 }}/>
              </LineChart>
            </div>
        </section>
      </section>
    );
  }