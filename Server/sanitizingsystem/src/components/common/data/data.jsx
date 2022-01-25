import React, { useEffect, useState } from "react";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, LabelList} from 'recharts';
import './data.css'
import {LineChartData} from './linechart';


export let data =  [
  { name: 'Sanitizer X', value: 2 },
  { name: 'The Seventh Ring', value: 4 },
  { name: 'Jims Office', value: 5 },
  { name: 'Swamp Office', value: 6 },
  { name: 'Korgs', value: 7 },
  { name: 'Borgs', value: 8 },
];


let test = [];
let lineGraphTest = [
  { name: "Sun", sanitizations: 0 },
  { name: "Mon", sanitizations: 0 },
  { name: "Tues", sanitizations: 0 },
  { name: "Wed", sanitizations: 0 },
  { name: "Thurs", sanitizations: 0 },
  { name: "Fri", sanitizations: 0 },
  { name: "Sat", sanitizations: 0 }
];


const Device = (props) => { 

  let x = props.doorsSanid.doorsSanid;
  let y = props.doorsSanid.grmsKild;

  // for(let i = 0; i <data.length; i++)
  // {
  //   data[i].value = y;
  // }

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

    //Push read data to dynamic data array (pie chart and line graph)
    const d = new Date();
    for (let i = 0; i < stat.length; i++)
    {
      if (typeof test[i] == 'undefined')
      {
        test.push({name: 'Device ' + (i+1).toString(), value: stat[i].doorsSanid});
        lineGraphTest[d.getDay()].sanitizations += stat[i].doorsSanid;
      }

      if (test[i].name === 'Device ' + (i+1).toString() && test[i].value !== stat[i].doorsSanid)
      {
        lineGraphTest[d.getDay()].sanitizations -= test[i].value; //subtract the old value
        test[i].value = stat[i].doorsSanid;
        lineGraphTest[d.getDay()].sanitizations += stat[i].doorsSanid; //add the new value
      }
      else if (test[i].name === 'Device ' + (i+1).toString() && test[i].value === stat[i].doorsSanid)
      {
        continue;
      }
    }
    console.log(test)
    console.log(lineGraphTest[d.getDay()].sanitizations)
  }

  function getter() {
    console.log("Getter called")

    return stat.map( (doors) => {
            return (
                <Device
                  key={stat._id}
                  doorsSanid={doors}
                />
            );   
      })}

  return (
    <section id="containment-field">
      {getter()}
      {setter()}
  

      <section>
        <div id="toplvlhead">
          <h1>   & Data</h1>
        </div>
      </section> */}

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

          <LineChartData/>

      </section>

    </section>
  );
}