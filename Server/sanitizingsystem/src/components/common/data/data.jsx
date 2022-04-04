import React, { useEffect, useState } from "react";
import axios from 'axios';
import { PieChart, Pie, Tooltip } from 'recharts';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis ,Radar, Legend } from 'recharts'
import { BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts'
import './data.css'
import {LineChartData} from './linechart';
import Dropdown from 'react-bootstrap/Dropdown'
import { dataQuery } from '../stats/stats'
import { deviceQuery } from "./linechart";
import { getUser } from "../navbar/Common";


// export let data = [{name: "Device 1", value: 10}];
export let url = new URL(window.location.href);
export let graphQuery = "&graph=";
export let overallTotal = 0;
export let data = [{name: "Device 1", value: 10}];

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
          <Dropdown.Item href= {"?graph=pie" + dataQuery + deviceQuery} onClick={() => {window.location.reload(true);}}> Pie Chart </Dropdown.Item>
          <Dropdown.Item href={"?graph=bar"+ dataQuery + deviceQuery}  onClick={() => {window.location.reload(true);}}> Bar Chart </Dropdown.Item>
          <Dropdown.Item href={"?graph=radar" + dataQuery + deviceQuery}  onClick={() => {window.location.reload(true);}}> Radar Chart </Dropdown.Item>
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
          <PolarAngleAxis dataKey="name" stroke="#666666"/>
          <PolarRadiusAxis angle={30} domain={[0, 4000]} />
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

  // get data from the database
  const [fetchedData, setData] = useState([]);
  let username = getUser().username;
  
  useEffect(() => {
    async function getStats() 
    {
        const resp = await axios.get(`http://54.90.139.97/api/handleData/getLinkedAccount?linkedAccount=${username}`);
        const getData = resp.data;
        
        //Clear the template data
        data.pop();

        for (let i = 0; i < getData.length; i++)
        {
          if (typeof data[i] == 'undefined')
          {
            data.push({name: (getData[i].deviceId).toString(), value: getData[i].lifetimeInteractions});
          }

          if (data[i].name === (getData[i].deviceId).toString() && getData[i].value !== getData[i].lifetimeInteractions)
          {
            data[i].value = getData[i].lifetimeInteractions;
          }
          overallTotal += getData[i].lifetimeInteractions; 
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