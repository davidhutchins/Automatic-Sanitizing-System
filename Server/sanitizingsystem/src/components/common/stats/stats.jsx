import React, { useEffect, useState } from "react";
import './stats.css'
import { Data } from '../../common';
import { overallTotal, ldata, weeklyTotal } from "../data/linechart";
import { url, graphQuery } from "../data/data";
import { getUser, getToken } from "../navbar/Common"
import Dropdown from 'react-bootstrap/Dropdown'

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
function displayDevice() 
{
  console.log(window.location.href);
  if (window.location.href.includes("daily")) 
  {
    dataQuery="&sanitizations=daily";
    return displayDropDownData(ldata[d.getDay()].Sanitizations);
  }
  else if (window.location.href.includes("weekly"))
  {
    dataQuery="&sanitizations=weekly";
    return displayDropDownData(weeklyTotal);
  }
  else if (window.location.href.includes("overall"))
  {
    dataQuery+="&sanitizations=overall";
    return displayDropDownData(overallTotal);
  }
  else 
  {
    dataQuery="&sanitizations=daily";
    return displayDropDownData(ldata[d.getDay()].Sanitizations);
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
          <Dropdown.Item href={"?sanitizations=daily" + graphQuery} onClick={() => {window.location.href = url.searchParams.set('sanitizations', 'daily'); window.location.reload(true);}}> Daily </Dropdown.Item>
          <Dropdown.Item href={"?sanitizations=weekly" + graphQuery} onClick={() => {window.location.href = url.searchParams.set('sanitizations', 'weekly'); window.location.reload(true);}}> Weekly </Dropdown.Item>
          <Dropdown.Item href={"?sanitizations=overall" + graphQuery} onClick={() => {window.location.href = url.searchParams.set('sanitizations', 'overall'); window.location.reload(true);}}> Overall </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

    </div>
  )
}

//attempt to GET data from the mongodb server
export default function Statistics() 
{
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
                  {displayDevice()}
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