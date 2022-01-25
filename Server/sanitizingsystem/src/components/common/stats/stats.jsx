import React, { useEffect, useState } from "react";
import './stats.css'
import {Data} from '../../common';


const Device = (props) => { 
  let x = props.doorsSanid.doorsSanid;
  return (
        <tbody>
          <tr>
            <td>
              <h3>{x}</h3>
            </td>
          </tr>
        </tbody>
  );
};



const Dev = (props) => {
  let y = props.doorsSanid.grmsKild;
  return (
    
    <tbody>
          <tr>
          <td>
              <h3>{y}</h3>
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
         //   console.log(stat);
    }, [stat.length]);


  //Door Statistics
  function StatusDoors () {
    return stat.map( (doors) => {
      console.log(doors.doorsSanid); //this is it too
      let valued = doors.doorsSanid;
      console.log(valued);
            return (
                <Device
                  key={stat._id}
                  doorsSanid={doors}
                />
                
            );
           
      })}


    function StatusGerms () {
      return stat.map( (germs) => {
        console.log(germs);
        console.log(germs.doorsSanid); //this is it
              return (
                  <Dev
                    key={stat._id}
                    doorsSanid={germs}
                  />
              );
        })}
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
                { StatusDoors() }
             </div>
           </div>
           <div id="subheader">
               <h2 id="title">Total Number Of Germs Killed</h2>
                 <div id="stats">
                 { StatusGerms() }
               
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