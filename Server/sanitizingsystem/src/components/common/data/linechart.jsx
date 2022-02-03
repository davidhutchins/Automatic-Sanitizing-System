import React, { useEffect, useState } from "react";
import {  Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import './data.css'

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

  return true;
};

export function LineChartData() {  

    //get data from the database
    const [wk, setwk] = useState([]);
  
    useEffect(() => {
          async function getLineData() 
          {
            //gets the data from the database at the localhost specified
            const weekDater = await fetch(`http://localhost:2000/weekdata?handleId=30`);
  
              //if there is no response then give this message
              if (!weekDater.ok) 
              {
                  const msg = `An error occurred: ${weekDater.statusText}`;
                  window.alert(msg);
                  return;
              }
  
              //stat = the fetched data in json format
              let wk = await weekDater.json();
              delete wk.doorsSanid;
              setwk(wk);              
            }
            getLineData();
    }, []);
  
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
              <XAxis dataKey="Day" />
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
  