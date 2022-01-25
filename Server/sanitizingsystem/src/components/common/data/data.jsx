import React, { useEffect, useState } from "react";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, LabelList} from 'recharts';
import './data.css'
import {LineChartData} from './linechart';


//!! To fix the issue of having to read several collections, lets make one jsx file dedicated to the line chart
//!! It has all the code needed to read it in the JSON format then we can call it in the html portion below


//main Concern is how the hell do you scale this

 let data =  [
  { name: 'Sanitizer X', value: null },
  { name: 'The Seventh Ring', value: null },
  { name: 'Jims Office', value: null },
  { name: 'Swamp Office', value: null },
  { name: 'Korgs', value: null },
  { name: 'Borgs', value: null },
];



const Device = (props) => { 
  let x = props.doorsSanid.doorsSanid;
  data[1].value  = x
  for(let i = 0; i <data.length; i++)
  {
    data[i].value = x;

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
  }, [stat.length, ]);

  function getter () {
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
{/*   
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
              <Pie dataKey="value" isAnimationActive={true} data={data} cx={200} cy={200} outerRadius={80} fill="#5E9A50" label/>
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


