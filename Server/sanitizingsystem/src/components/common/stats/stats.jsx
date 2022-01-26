import React, { useEffect, useState } from "react";
import './stats.css'
import {Data} from '../../common';
import { ldata } from "../data/linechart";

const d = new Date();

const Device = (props) => { 
  return (
        <tbody>
          <tr>
            <td>
              <h3>{ldata[d.getDay()].sanitizations}</h3>
            </td>
          </tr>
        </tbody>
  );
};

//attempt to GET data from the mongodb server
export default function Statistics() 
{
    const [stat, setstat] = useState([]);

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
              setstat(stat);

            }
            getStats();
    }, [stat.length]);

        console.log("BF");
        console.log(stat.length);
        //stat[0] only exists
        // console.log(stat.doorsSanid); undefined
  return (
    <section className="content">
        <section>

        <div id="pageTitle">
            <h1>Sanitizing Statistics & Data</h1>  
            <div id="subheader">
            <h2 id="title">Total Number Of Doors Sanitized</h2>
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