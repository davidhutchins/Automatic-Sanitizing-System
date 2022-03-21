import React, { useEffect, useState } from "react";
import axios from 'axios';
import { PieChart, Pie, Tooltip } from 'recharts';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis ,Radar, Legend } from 'recharts'
import { BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts'
import './data.css'
import {LineChartData} from './linechart';
import Dropdown from 'react-bootstrap/Dropdown'
import { dataQuery } from '../stats/stats'


export let data = [{name: "Device 1", value: 10}];
export let overallTotal = 0;
export let url = new URL(window.location.href);
export let graphQuery = "&graph=";

function DropDownMenu() {
  return (
    <div>
      <style>
      <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
          crossorigin="anonymous"
        />
      </style>
      <Dropdown>

        <Dropdown.Toggle id="dark" variant="secondary">  Select Graph Type </Dropdown.Toggle>

        <Dropdown.Menu variant="dark">
          {/* must do a window href location refresh followed by a page refresh in order to change the text when you click the button*/}
          <Dropdown.Item href= {"?graph=pie" + dataQuery} onClick={() => {window.location.href = url.searchParams.set('graph', 'pie'); window.location.reload(true);}}> Pie Chart </Dropdown.Item>
          <Dropdown.Item href={"?graph=bar"+ dataQuery}  onClick={() => {window.location.href = url.searchParams.set('graph', 'bar'); window.location.reload(true);}}> Bar Chart </Dropdown.Item>
          <Dropdown.Item href={"?graph=radar" + dataQuery}  onClick={() => {window.location.href = url.searchParams.set('graph', 'radar'); window.location.reload(true);}}> Radar Chart </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

    </div>
  )
}

function displayData(fetchedData) {
  console.log(fetchedData);

  if (window.location.href.includes("pie"))
  {
    graphQuery = "&graph=pie" 
    return (
      <div id="pie">
        <PieChart width={440} height={340}>
          <Pie dataKey="value" isAnimationActive={true} data={fetchedData} cx={200} cy={200} outerRadius={80} fill="#5E9A50" label/>
          <Tooltip />
        </PieChart>
      </div>
    );
  }
  else if (window.location.href.includes("bar"))
  {
    graphQuery="&graph=bar"
    return (
      <div id="bar">
        <BarChart width={440} height={340} data={fetchedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" data={fetchedData} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" data={fetchedData} fill="#5E9A50" />
        </BarChart>
      </div>
    );
  }
  else if (window.location.href.includes("radar"))
  {
    graphQuery="&graph=radar";
    return (
      <div id="radar">
        <RadarChart outerRadius={90} width={440} height={340} data={fetchedData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name"/>
          <PolarRadiusAxis angle={30} domain={[0, 4000]} />
          {/* TODO: Figure out how to make chart dynamic */}
          <Radar dataKey="value" data={fetchedData} stroke="#5E9A50" fill="#5E9A50" fillOpacity={0.6} />
          <Legend />
        </RadarChart>
      </div>
    );
  }
  else 
  {
    graphQuery="&graph=pie";
    return (
      <div id="pie">
        <PieChart width={440} height={340}>
          <Pie dataKey="value" isAnimationActive={true} data={fetchedData} cx={200} cy={200} outerRadius={80} fill="#5E9A50" label/>
          <Tooltip />
        </PieChart>
      </div>
    );
  }
}

export default function Data() {  

  //get data from the database
  const [fetchedData, setData] = useState([]);
  

  useEffect(() => {
  async function getStats() 
  {
      //gets the data from the database at the localhost specified
      //const resp = await fetch(`http://54.90.139.97/api/data/`);
      const resp = await fetch(`http:/localhost:2000/handleData/`);


      //if there is no response then give this message
      if (!resp.ok) 
      {
        const msg = `An error occurred: ${resp.statusText}`;
        window.alert(msg);
        return;
      }

      //stat = the fetched data in json format
      const stat = await resp.json();
      console.log(stat);

      //Push read data to dynamic data array (pie chart and line graph)
      data.pop(); //Get rid of default data
      for (let i = 0; i < stat.length; i++)
      {
        if (typeof data[i] == 'undefined')
        {
          data.push({name: 'Device ' + (stat[i].deviceId).toString(), value: stat[i].lifetimeInteractions});
        }

        if (data[i].name === 'Device ' + (stat[i].deviceId).toString() && data[i].value !== stat[i].lifetimeInteractions)
        {
          data[i].value = stat[i].lifetimeInteractions;
        }
        overallTotal += stat[i].lifetimeInteractions;
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
        {displayData(fetchedData)}
        <div id="dropdown">{DropDownMenu()}</div>
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