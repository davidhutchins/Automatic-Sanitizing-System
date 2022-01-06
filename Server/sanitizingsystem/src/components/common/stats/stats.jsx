import React from 'react';
import './stats.css'
import { deviceStats } from "./data";

//Door Statistics
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
                />
              </div>
            );
          })}
        </div>
      </>
    );
  };

  //Germ Statistics
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
                />
              </div>
            );
          })}
        </div>
      </>
    );
  };
  
  
  
  const Device = ({ doorsSanid, grmsKild }) => {
    return (
      <table>
        <tbody>
          <tr>
            <td>
              <h3>{doorsSanid}</h3>
                    
            </td>
  
            <td>
              <h3>{grmsKild}</h3>
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
               <div id="subheader">
                <h2 id="title">Total Number Of Doors Sanitized</h2>
                  <div id="stats">
                    <StatusDoors />
                  </div>
                </div>
                <div id="subheader">
                    <h2 id="title">Total Number Of Germs Killed</h2>
                      <div id="stats">
                      <StatusGerms />
                    </div>
                </div>
           </div>          
       </section>

    )
}

export default Stats;