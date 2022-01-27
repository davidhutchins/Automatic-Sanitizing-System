import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip } from 'recharts';
import './data.css'
import {LineChartData} from './linechart';

export let data = [{name: "Device 1", value: 10}];


export default function Data() {  

  //get data from the database
  const [fetchedData, setData] = useState([]);
  

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

      //Push read data to dynamic data array (pie chart and line graph)
      for (let i = 0; i < stat.length; i++)
      {
        if (typeof data[i] == 'undefined')
        {
          data.push({name: 'Device ' + (i+1).toString(), value: stat[i].doorsSanid});
        }

        if (data[i].name === 'Device ' + (i+1).toString() && data[i].value !== stat[i].doorsSanid)
        {
          data[i].value = stat[i].doorsSanid;
        }
        else if (data[i].name === 'Device ' + (i+1).toString() && data[i].value === stat[i].doorsSanid)
        {
          continue;
        }
      }
      
      setData(data);
    }
    getStats();
  }, []);

  return (
    <section id="containment-field">
      <section>
        <div id = "desc1">
          <h1>Sanitizings Per Device</h1>
        </div>
        <div id="pie">
          <PieChart width={440} height={340}>
            <Pie dataKey="value" isAnimationActive={true} data={fetchedData} cx={200} cy={200} outerRadius={80} fill="#5E9A50" label/>
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