import React from "react";
import "./levels.css";
import { deviceData } from "./pwr";
import ProgressBar from 'react-bootstrap/ProgressBar'



//Title Bar
const PageTitle = () => {
    return (
      <header id="page-title">
        <h2>Sanitizer Power Levels</h2>
        
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
                DoorsSanitized={data.DoorsSanitized}
                GermsKilled={data.GermsKilled}
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
                  <ProgressBar variant="success" now={DeviceID} />
      <tbody>
        <tr>
          <td>
            <h5>{DeviceID}</h5>
                  
          </td>
          <td>
            <h5>{Battery}</h5>
          </td>
          <td>
            <h4>{DoorsSanitized}</h4>
          </td>
          <td>
            <p>{GermsKilled}</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};