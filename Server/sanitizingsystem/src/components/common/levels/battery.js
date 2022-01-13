import React from "react";
import "./levels.css";
import { deviceData } from "./pwr";
import { Col } from "react-bootstrap";


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
              />
            </div>);})}
      </div>
    </>
  );
};



const Device = ({ DeviceID, Battery}) => {
  if (!DeviceID) return <div />;
  return (
    
    <table>
      <tbody>
        <tr>
          <td>
            <h5 id="devID">{DeviceID}</h5>   
          </td>
          <td>
            <Col id= "percent">
            <h5 id="prcnt-container">{Battery}</h5>
            </Col>
          </td>
          </tr>
          </tbody>
      
    </table>
  
  );
};