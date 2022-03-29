import React, { useEffect, useState } from "react";
import {  Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import './data.css';
import {data} from '../data/data'
import { getUser } from "../navbar/Common";
import { graphQuery } from "../data/data";
import { dataQuery } from '../stats/stats'
import Dropdown from 'react-bootstrap/Dropdown'


//import database from  '../../../server/database/connector'
export let weeklyTotal = 0;
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

export let deviceQuery = "&deviceID=";
let deviceIndex = 0;
export let deviceID = 0;


function DropDownMenu(linkedAccounts) {
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

        <Dropdown.Toggle id="dark" variant="secondary">  Device Select </Dropdown.Toggle>
        <Dropdown.Menu variant="dark">
          {selectDevice(linkedAccounts)}
        </Dropdown.Menu>
      </Dropdown>

    </div>
  ) 
}
function selectDevice(linkedAccounts) {
  let items = [];
  for (let i = 0; i < linkedAccounts.length; i++)
  {
    items.push(<Dropdown.Item href={`?deviceID=${linkedAccounts[i]}` + graphQuery + dataQuery} 
      onClick={() => {window.location.reload(true);}} key={i} value={linkedAccounts[i]}>{linkedAccounts[i]}</Dropdown.Item>)
  }
  return items;
}

async function ChangeCharts(linkedAccounts)
{
  if (window.location.href.includes("deviceID"))
  {
    console.log(linkedAccounts);
    const urlParams = new URLSearchParams(window.location.search);
    let id = parseInt(urlParams.get('deviceID'));
    deviceID = id;
    deviceQuery = `&deviceID=${id}`;
    let index = linkedAccounts.indexOf(id, 0);
    return index;
  }
  else
  {
    deviceID = linkedAccounts[0];
    deviceQuery = `&deviceID=${linkedAccounts[0]}`;
    return 0;
  }
}

export function LineChartData() {  

    // //get data from the database
    const [weekData, setWeekData] = useState([]);
    const [linkedAccounts, setAccounts] = useState([]);
    let username = getUser().username;
  
    useEffect(() => {
          async function getLineData() 
          {
            //gets the data from the database at the localhost specified
            //const weekDater = await fetch(`http://54.90.139.97/api/weekdata?handleId=30`);
            const stats = await fetch(`http://localhost:2000/handleData/getLinkedAccount?linkedAccount=${username}`);
  
              //if there is no response then give this message
              if (!stats.ok) 
              {
                  const msg = `An error occurred: ${stats.statusText}`;
                  window.alert(msg);
                  return;
              }
  
              //stat = the fetched data in json format
              const getData = await stats.json();
              console.log(getData);
              let allAccounts = [];
              //Get all the device IDs linked to account
              for (let i = 0; i < getData.length; i++)
              {
                allAccounts.push(getData[i].deviceId);
              }

              console.log(allAccounts);
              //Get index of device selected
              deviceIndex = await ChangeCharts(allAccounts);
              console.log("Device id: " + deviceIndex);

              //Load the data from JSON into array to display on line chart
              ldata[0].Sanitizations = getData[deviceIndex].Sunday;
              ldata[1].Sanitizations = getData[deviceIndex].Monday;
              ldata[2].Sanitizations = getData[deviceIndex].Tuesday;
              ldata[3].Sanitizations = getData[deviceIndex].Wednesday;
              ldata[4].Sanitizations = getData[deviceIndex].Thursday;
              ldata[5].Sanitizations = getData[deviceIndex].Friday;
              ldata[6].Sanitizations = getData[deviceIndex].Saturday;
                
              weeklyTotal = getData[deviceIndex].Sunday + 
                  getData[deviceIndex].Monday + 
                  getData[deviceIndex].Tuesday + 
                  getData[deviceIndex].Wednesday + 
                  getData[deviceIndex].Thursday + 
                  getData[deviceIndex].Friday + 
                  getData[deviceIndex].Saturday;
              
              setWeekData(ldata);
              setAccounts(allAccounts);
            }
            getLineData();
            console.log(deviceIndex);

            console.log(data);
    }, []);
    
    return (
      <section>
        <section>
            <div id="line">
              <LineChart width={440} height={340} data={weekData} margin={{top: 40, right: 0, left: 0, bottom: 0}}>
                <CartesianGrid stroke="#ccc" strokeDasharray="1 1"  />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Sanitizations" stroke="#5E9A50" activeDot={{ r: 10 }}/>
              </LineChart>
            </div>
            <div id="deselMenu">
              {DropDownMenu(linkedAccounts)}
            </div>
        </section>
      </section>
    );
  }