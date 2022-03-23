import React, { useEffect, useState } from "react";
import './stats.css'
import { Data } from '../../common';
import { ldata } from "../data/linechart";
import { graphQuery } from "../data/data";
import { getUser, getToken } from "../navbar/Common"
import Dropdown from 'react-bootstrap/Dropdown'
import { overallTotal } from "../data/data";

const d = new Date();
export let dataQuery = "&sanitizations="

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

        <Dropdown.Toggle id="dark" variant="secondary">  Data Select </Dropdown.Toggle>
        <Dropdown.Menu variant="dark">
          {/* must do a window href location refresh followed by a page refresh in order to change the text when you click the button */}
          <Dropdown.Item href={"?sanitizations=daily" + graphQuery} onClick={() => {window.location.reload(true);}}> Daily </Dropdown.Item>
          <Dropdown.Item href={"?sanitizations=weekly" + graphQuery} onClick={() => {window.location.reload(true);}}> Weekly </Dropdown.Item>
          <Dropdown.Item href={"?sanitizations=overall" + graphQuery} onClick={() => {window.location.reload(true);}}> Overall </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

    </div>
  ) 
}

//attempt to GET data from the mongodb server
export default function Statistics() 
{
  const [weeklyTotal, setTotal] = useState([]);

  useEffect(() => {
    async function getLineData() 
    {
      //gets the data from the database at the localhost specified
      //const weekDater = await fetch(`http://54.90.139.97/api/weekdata?handleId=30`);
      //TODO: Make the handleID user specific
      const stats = await fetch(`http://localhost:2000/handleData`);

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

        //Load the data from JSON into array to display on line chart
        ldata[0].Sanitizations = getData[0].Sunday;
        ldata[1].Sanitizations = getData[0].Monday;
        ldata[2].Sanitizations = getData[0].Tuesday;
        ldata[3].Sanitizations = getData[0].Wednesday;
        ldata[4].Sanitizations = getData[0].Thursday;
        ldata[5].Sanitizations = getData[0].Friday;
        ldata[6].Sanitizations = getData[0].Saturday;
          
        const weeklyData = getData[0].Sunday + 
            getData[0].Monday + 
            getData[0].Tuesday + 
            getData[0].Wednesday + 
            getData[0].Thursday + 
            getData[0].Friday + 
            getData[0].Saturday;

        setTotal(weeklyData);
        
      }
      getLineData();
      // console.log(wk)
    }, []);

  return (
    <section className="content">
        <section>
        {console.log("Logged in as: " + getUser().username)}
        {console.log("Token: " + getToken())}
        <div id="pageTitle">
            <h1>Sanitizing Statistics & Data</h1>  
            <h2 id="saniz">Total Number Of Doors Sanitized</h2>
            <div id="subheader">
              <br></br>
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