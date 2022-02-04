import React, { useEffect, useState } from "react";
import './stats.css'
import { Data } from '../../common';
import { ldata } from "../data/linechart";

const d = new Date();

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
            <h2 id="title">Total Number Of Doors Sanitized (Daily)</h2>
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