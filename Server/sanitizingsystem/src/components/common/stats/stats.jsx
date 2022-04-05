import React, { useEffect, useState } from "react";
import './stats.css'
import { Data } from '../../common';
import { ldata, deviceID, deviceQuery, deviceIndex } from "../data/linechart";
import { graphQuery } from "../data/data";
import { getUser, getToken } from "../navbar/Common"
import Dropdown from 'react-bootstrap/Dropdown'
import { overallTotal } from "../data/data";

const d = new Date();
export let dataQuery = "&sanitizations=daily"
export const userToken = getToken();

function displayDropDownData(data) {
  return (
    <tbody>
      <tr>
        <td>
          <h3>{data}</h3>
        </td>
      </tr>
    </tbody>
  );
}

// This function takes the data of sanitized objects and passes them into a function that returns html
function displayDevice(totals) 
{
  if (window.location.href.includes("daily")) 
  {
    dataQuery="&sanitizations=daily";
    return displayDropDownData(totals[0]);
  }
  else if (window.location.href.includes("weekly"))
  {
    dataQuery="&sanitizations=weekly";
    return displayDropDownData(totals[1]);
  }
  else if (window.location.href.includes("overall"))
  {
    dataQuery="&sanitizations=overall";
    return displayDropDownData(totals[2]);
  }
  else 
  {
    dataQuery="&sanitizations=daily";
    return displayDropDownData(totals[0]);
  }
};

function DropDownMenu() {
  return (
    <div className="devicesss">
      <style>
      <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
          crossorigin="anonymous"
          />
      </style>
      <Dropdown>

        <Dropdown.Toggle id="dd_time" variant="secondary">  Data Select </Dropdown.Toggle>
        <Dropdown.Menu variant="dark">
          {/* must do a window href location refresh followed by a page refresh in order to change the text when you click the button */}
          <Dropdown.Item href={"?sanitizations=daily" + graphQuery + deviceQuery} onClick={() => {window.location.reload(true);}}> Daily </Dropdown.Item>
          <Dropdown.Item href={"?sanitizations=weekly" + graphQuery + deviceQuery} onClick={() => {window.location.reload(true);}}> Weekly </Dropdown.Item>
          <Dropdown.Item href={"?sanitizations=overall" + graphQuery + deviceQuery} onClick={() => {window.location.reload(true);}}> Overall </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

    </div>
  ) 
}

//attempt to GET data from the mongodb server
export default function Statistics() 
{
  const [weeklyTotal, setTotal] = useState([]);
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
                  
        const weeklyData = getData[0].Sunday + 
            getData[deviceIndex].Monday + 
            getData[deviceIndex].Tuesday + 
            getData[deviceIndex].Wednesday + 
            getData[deviceIndex].Thursday + 
            getData[deviceIndex].Friday + 
            getData[deviceIndex].Saturday;

        setTotal(weeklyData);
        
      }
      getLineData();
      // console.log(wk)
    }, []);

  return (
    <section className="content">
        <section>
        <div id="pageTitle">
            <h1>Sanitizing Statistics & Data</h1>  
            <h2 id="saniz">Total Number Of Doors Sanitized</h2>
            <div id="subheader">
              <br></br>
            <h2 id="saniz">Device Selected: {deviceID}</h2>
            <br></br>
              {DropDownMenu()}
              <br></br>
              <div id="stats">
                  {displayDevice([ldata[d.getDay()].Sanitizations, weeklyTotal, overallTotal])}
              </div>
            </div>
        </div>       
        </section>

        <section>
          {Data()}
        </section>
    </section>
  );
}