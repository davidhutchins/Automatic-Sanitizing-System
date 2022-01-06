import React from "react";
import "./levels.css";
import { deviceData } from "./pwr";



//Title Bar
const PageTitle = () => {
    return (
   
      <header id="page-title">
        <h1>Sanitizer Power Levels</h1>  
      </header> 


    );
  };

export const Devices = () => {
  return (
    <>
      <PageTitle />
      <div className="device-list">
        {deviceData.map((data, key) => {
          return (
            <div key={key}>
              <Device
                key={key}
                DeviceID={data.DeviceID}
                Battery={data.Battery}
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



const Device = ({ DeviceID, Battery, DoorsSanitized, GermsKilled }) => {
  if (!DeviceID) return <div />;
  return (
    <table>
    {/* 
      <tbody>
        <tr>
          <td>
            <h5 id="devID">{DeviceID}</h5>
                  
          </td>

          <td>
            <Col id= "frce">
            <h5 id="bat">{Battery}</h5>
            </Col>
          </td>
         <td>
            <h4>{DoorsSanitized}</h4>
          </td>
          <td>
            <p>{GermsKilled}</p>
          </td>
          </tr>
          </tbody>
        */} 
    </table>
  );
};