import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip } from 'recharts';
import './data.css'
import {LineChartData} from './linechart';

let data = [];

// const Device = (props) => { 

//   let x = props.doorsSanid.doorsSanid;
//   let y = props.doorsSanid.grmsKild;

//   // for(let i = 0; i <data.length; i++)
//   // {
//   //   data[i].value = y;
//   // }

//   return true;
// };

function renderPieChart() {
  return (
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
  );
}

export default function Data() {  


  //get data from the database
  const [stat, setstat] = useState(data);
  

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
            
            setstat(stat);
          }
          getStats();
  }, []);

  return (
    <section id="containment-field">
      <section>
        {renderPieChart()}
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