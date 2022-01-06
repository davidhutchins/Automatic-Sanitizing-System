import React from 'react';
import './stats.css'
import { deviceStats } from "./data";


export const StatusDoors = () => {
    return (
      <>
        <div className="device-stats">
          {deviceStats.map((data, key) => {
            return (
              <div key={key}>
                <Device
                  key={key}
                  doorsSanid={data.doorsSanid}
                //  grmsKild={data.grmsKild}
                //  DoorsSanitized={data.DoorsSanitized}
                 // GermsKilled={data.GermsKilled}
                />
              </div>
            );
          })}
        </div>
      </>
    );
  };

  export const StatusGerms = () => {
    return (
      <>
        <div className="device-sta">
          {deviceStats.map((data, key) => {
            return (
              <div key={key}>
                <Device
                  key={key}
                  grmsKild={data.grmsKild}
                 // doorsSanid={data.doorsSanid}
                //  DoorsSanitized={data.DoorsSanitized}
                 // GermsKilled={data.GermsKilled}
                />
              </div>
            );
          })}
        </div>
      </>
    );
  };
  
  
  
  const Device = ({ doorsSanid, grmsKild, DoorsSanitized, GermsKilled }) => {
   // if (!doorsSanid) return <div />;
    return (
      <table>
        <tbody>
          <tr>
            <td>
              <h5 id="devID">{doorsSanid}</h5>
                    
            </td>
  
            <td>
              <h5 id="bat">{grmsKild}</h5>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

function Stats() {
  
    return (
       <section className="content">
           
           <div id="pageTitle">
               <h1>Sanitizing Statistics</h1>
           </div>
{/*
           <div id="subheader">
               <h2 id="title">Total Number Of Doors Sanitized</h2>
               <div id="numsanis">
               <StatusDoors />
               </div>
           </div>

           <div id="germKill">
               <h2 id="title">Total Number Of Germs Killed</h2>
               <div id="germy">
               <StatusGerms />
               </div>
           </div>
*/}
{/*
           <div id = "deviceStatistics">
           <h4>Device Statistics</h4>
           
           
           </div>
*/ }
           
       </section>

    )
}

export default Stats;