import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip } from 'recharts';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis ,Radar, Legend } from 'recharts'
import './data.css'
import {LineChartData} from './linechart';
import Dropdown from 'react-bootstrap/Dropdown'


export let data = [{name: "Device 1", value: 10}];
export let overallTotal = 0;

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
          <Dropdown.Item href="#/pie" onClick={() => {window.location.href="/stats#/pie"; window.location.reload(true);}}> Pie Chart </Dropdown.Item>
          <Dropdown.Item href="#/bar" onClick={() => {window.location.href="/stats#/bar"; window.location.reload(true);}}> Bar Chart </Dropdown.Item>
          <Dropdown.Item href="#/radar" onClick={() => {window.location.href="/stats#/radar"; window.location.reload(true);}}> Radar Chart </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

    </div>
  )
}

function displayData(fetchedData) {
  console.log(fetchedData);

  if (window.location.href.includes("/pie")) {
    return (
      <div id="pie">
        <PieChart width={440} height={340}>
          <Pie dataKey="value" isAnimationActive={true} data={fetchedData} cx={200} cy={200} outerRadius={80} fill="#5E9A50" label/>
          <Tooltip />
        </PieChart>
      </div>
    );
  }
  else if (window.location.href.includes("/radar"))
  {
    return (
      <div id="pie">
        <RadarChart outerRadius={90} width={730} height={250} data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis angle={30} domain={[0, 4000]} />
          {/* TODO: Figure out how to make chart dynamic */}
          <Radar dataKey="value" data={fetchedData} stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Legend />
        </RadarChart>
      </div>
    );
  }
  else 
  {
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
      const resp = await fetch(`http://54.174.75.180/api/data/`);


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
      data.pop(); //Get rid of default data
      for (let i = 0; i < stat.length; i++)
      {
        if (typeof data[i] == 'undefined')
        {
          data.push({name: 'Device ' + (stat[i].doorsSanid).toString(), value: stat[i].grmsKild});
        }

        if (data[i].name === 'Device ' + (stat[i].doorsSanid).toString() && data[i].value !== stat[i].grmsKild)
        {
          data[i].value = stat[i].grmsKild;
        }
        overallTotal += stat[i].grmsKild;
      }
      setData(data);
    }

    getStats();
  }, []);

  return (
    <section id="containment-field">
      <br></br>
        {DropDownMenu()}
      <br></br>
      <section>
        <div id = "desc1">
          <h1>Sanitizings Per Device</h1>

        </div>
        {displayData(fetchedData)}
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