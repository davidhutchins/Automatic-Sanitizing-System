import React, { useEffect, useState } from "react";
import './stats.css'

const Device = (props) => {
  return (
    
        <tbody>
          <tr>
            <td>
              <h3>{props.doorsSanid.doorsSanid}</h3>
            </td>
          </tr>
          {/* <tr>
          <td>
              <h3>{props.doorsSanid.grmsKild}</h3>
            </td>
          </tr> */}
        </tbody>
  );
};

const Dev = (props) => {
  return (
    
        <tbody>
          <tr>
          <td>
              <h3>{props.doorsSanid.grmsKild}</h3>
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


//Door Statistics
function StatusDoors () {
  return stat.map( (doors) => {
          return (
              <Device
                key={stat._id}
                doorsSanid={doors}
              />
          );
    })}


    function StatusGerms () {
      return stat.map( (germs) => {
              return (
                  <Dev
                    key={stat._id}
                    doorsSanid={germs}
                  />
              );
        })}

return (
  <section className="content">
      
      <div id="pageTitle">
          <h1>Sanitizing Statistics</h1>  
          <div id="subheader">
           <h2 id="title">Total Number Of Doors Sanitized</h2>
             <div id="stats">
             {/*  <StatusDoors /> */}
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

);

}


