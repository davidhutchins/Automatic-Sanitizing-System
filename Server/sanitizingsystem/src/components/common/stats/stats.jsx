import React, { useEffect, useState } from "react";
import './stats.css'
import { Data } from '../../common';
import { ldata } from "../data/linechart";



const d = new Date();
let dataSelect = ["Daily", "Weekly", "Lifetime"];

// function clickOption()
// {
//   document.getElementById("demo").innerHTML = "YOU CLICKED ME!";
//   // <div id="stats">
//   //   {Device()}
//   // </div>
// }
const Device = (props) => { 
  return (
        <tbody>
          <tr>
            <td>
              <h3>{ldata[d.getDay()].Sanitizations}</h3>
            </td>
          </tr>
        </tbody>
  );
};

function DropDownMenu() {
  return (
    <div>
      <p id="demo" onclick="clickOption">Click me.</p>
      <div class="dropdown">
        <button class="dropbtn">Data Select</button>
          <div class="dropdown-content">
            <p> {dataSelect[0]} </p>
            <p> {dataSelect[1]} </p>
            <p> {dataSelect[2]} </p>
        </div>
      </div>
    </div>
  )
}

//attempt to GET data from the mongodb server
export default function Statistics() 
{
    const [loadedStatistics, getData] = useState([]);

    useEffect(() => {
          async function getStats() 
          {
            //gets the data from the database at the localhost specified
            const resp = await fetch(`http://54.242.85.61/api/data/`);
              //if there is no response then give this message
              if (!resp.ok) 
              {
                  const msg = `An error occurred: ${resp.statusText}`;
                  window.alert(msg);
                  return;
              }

              //stat = the fetched data in json format
              const stat = await resp.json();
              getData(stat);
            }
            getStats();
    }, [loadedStatistics]);

  return (
    <section className="content">
        <section>

        <div id="pageTitle">
            <h1>Sanitizing Statistics & Data</h1>  
            <div id="subheader">
            <h2 id="title">Total Number Of Doors Sanitized</h2>
              {DropDownMenu()}
              <div id="stats">
                  {Device()}
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