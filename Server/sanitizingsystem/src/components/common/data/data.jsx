import React, { useEffect, useState } from "react";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, LabelList} from 'recharts';
import './data.css'
import Statistics from "../stats/stats";
const doorNum = require("../stats/stats");

export let data =  [
  { name: 'Sanitizer X', value: 2 },
  { name: 'The Seventh Ring', value: 4 },
  { name: 'Jims Office', value: 5 },
  { name: 'Swamp Office', value: 6 },
  { name: 'Korgs', value: 7 },
  { name: 'Borgs', value: 8 },
];

export let ldata = [
  { name: "Mon", sanitizations: 10 },
  { name: "Tues", sanitizations: 10 },
  { name: "Wed", sanitizations: 20 },
  { name: "Thurs", sanitizations: 40 },
  { name: "Fri", sanitizations: 50 },
  { name: "Sat", sanitizations: 60 },
  { name: "Sun", sanitizations: 110 }
];

let test = [];
let lineGraphTest = []

//test function to verify read from database
const Device = (props) => { 

  let x = props.doorsSanid.doorsSanid;
  let y = props.doorsSanid.grmsKild;

  for(let i = 0; i <data.length; i++)
  {
    data[i].value = y;
  }

  for(let i = 0; i <ldata.length; i++)
  {
    ldata[i].sanitizations = x;
  }

  
  return true;
};

export default function Data() {  

  //get data from the database
  const [stat, setstat] = useState([]);

  useEffect(() => {
        async function getStats() 
        {
          //gets the data from the database at the localhost specified
          const resp = await fetch(`http://localhost:2000/data/`);
            //if there is no response then give this message
            if (!resp.ok) 
            {
                const msg = `An error occurred: ${resp.statusText}`;
                window.alert(msg);
                return;
            }

            //stat = the fetched data in json format
            const stat = await resp.json();
            setstat(stat);
          }
          getStats();

  }, [stat.length]);

  function setter() {
    console.log("Setter")
    //Push read data to dynamic data array
    for (let i = 0; i < stat.length; i++)
    {
      if (typeof test[i] == 'undefined')
      {
        test.push({name: 'Device ' + (i+1).toString(), value: stat[i].doorsSanid})
      }

      if (test[i].name === 'Device ' + (i+1).toString() && test[i].value !== stat[i].doorsSanid)
      {
        test[i].value = stat[i].doorsSanid;
      }
      else if (test[i].name === 'Device ' + (i+1).toString() && test[i].value === stat[i].doorsSanid)
      {
        continue;
      }
    }
    console.log(test)
  }

  function getter() {
    console.log("Getter")

    return stat.map( (doors) => {
            return (
                <Device
                  key={stat._id}
                  doorsSanid={doors}
                />
                
            );   
      })}

  return (
    <section>
      {getter()}
      {setter()}
  
      <section>
        <div id="toplvlhead">
          <h1>Sanitizer Data</h1>
        </div>
      </section>

      <section>
        <div id = "desc1">
          <h1>Sanitizings Per Device</h1>
        </div>
          <div id="pie">
            <PieChart width={440} height={340}>
              <Pie dataKey="value" isAnimationActive={true} data={test} cx={200} cy={200} outerRadius={80} fill="#5E9A50" label/>
              <Tooltip />
            </PieChart>
          </div>
      </section>

      <section>
        <div id = "desc">
          <h1>Operations Over The Week</h1>
        </div>
          <div id="line">
            <LineChart width={440} height={340} data={ldata} margin={{top: 40, right: 0, left: 0, bottom: 0}}>
            <CartesianGrid stroke="#ccc" strokeDasharray="1 1"  />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sanitizations" stroke="#5E9A50" activeDot={{ r: 10 }}/>
            </LineChart>
          </div>
      </section>

    </section>
  );
}