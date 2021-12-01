import React from "react";
import "./levels.css";
import { deviceData } from "./pwr";
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Col } from "react-bootstrap";



//Title Bar
const PageTitle = () => {
    return (
        <div className="page">
      <header id="page-title">
        <h2>Sanitizer Power Levels</h2>  
      </header> 
</div>

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
       {/* 
         <td>
            <h4>{DoorsSanitized}</h4>
          </td>
          <td>
            <p>{GermsKilled}</p>
          </td>
          */} 
        </tr>
      </tbody>
    </table>
  );
};