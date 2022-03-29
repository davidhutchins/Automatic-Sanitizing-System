import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './homepage.css';
import { getUser } from "../navbar/Common"
import axios from "axios";
 
// const
export default function AdddeviceId() {
 const [form, setForm] = useState({
   deviceId: "",
   lifetimeInteractions: "",
   Sunday: "",
   Monday: "",
   Tuesday: "",
   Wednesday: "",
   Thursday: "",
   Friday: "",
   Saturday: "",
   linkedAccount: "",
   verificationCode: ""
 });

 const navigate = useNavigate()
 
 let user = String(getUser().username);

 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
 
 // This function will handle the submission.
 async function onSubmit(e) 
 {
  const username = String(getUser().username);
  let errorWithCreation = false;
  e.preventDefault();
  
  if(form.deviceId === "") {
    //throw an error and tell them to try again
    window.alert("Please enter a valid Device ID.");
    errorWithCreation = true;
    setForm({deviceId: ""});
  }
  if (form.deviceId.includes(" "))
  {
    window.alert("deviceID contains whitespace. Please enter a valid ID number.");
    errorWithCreation = true;
    setForm({ deviceId: "", verificationCode: ""});
  }

  if (form.verificationCode.length !== 6)
  {
    window.alert("The verification code entered is not 6 digits. Please enter a valid verification code.");
  }

  // Add an edge case to prevent same user from adding the same deviceId (note: there should only be one unique deviceID)
  const getDeviceIDRes = await axios.get(`http://localhost:2000/handleData?deviceId=${form.deviceId}`);
  const deviceData = getDeviceIDRes.data;
  for (let i = 0; i < deviceData[0].linkedAccount.length; i++)
  {
    if (deviceData[0].linkedAccount[i] === username)
    {
      window.alert("Device ID is already linked to your account.");
      errorWithCreation = true;
      setForm({ deviceId: "", verificationCode: ""});
      break;
    }
  }
  
  //Add a case to reject when verification code does not match
  //Get all collections that matches verification code
  const verCodeRes = await axios.get(`http://localhost:2000/handleData/getVerificationCode?verificationCode=${form.verificationCode}`);
  const verCodeCollections = verCodeRes.data;
  console.log(verCodeCollections);

  //If the response is empty, that means no device ID matches the verification code
  if (verCodeCollections.length === 0)
  {
    window.alert("Verification code does not match Device ID. Please try again.");
    errorWithCreation = true;
    setForm({ deviceId: "", verificationCode: ""});
  }

  //If there are no problems with deviceID or verificationCode fields, then add to database
  if (!errorWithCreation) 
  {
      const newPerson = { ...form };

      await fetch("http://localhost:2000/handleData/register", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPerson),
      })
      .catch(error => {
        window.alert(error);
      });

      window.alert("Device successfully linked! Redirecting to the statistics page.");
      setForm({ deviceId: "", verificationCode: ""});
      navigate("/stats");
  }
}

    // This following section will display the form that takes the input from the user.
    return (
        <div>
        <div id='deviceIdAdd'>
            <h3  id='glow'>Add Device</h3>
            <br/>
            <br/>
            <br/>
        </div>
        <div id='moveit'>
        <form onSubmit={onSubmit}>
            <br/>
        <div className="form-groupa">
          <label htmlFor="deviceId" id='glow'>Enter Device's ID <br/></label>
          <input
            type="number"
            required
            className="form-control"
            id="deviceId"
            value={form.deviceId}
            onChange={(e) => updateForm({ deviceId: e.target.value, linkedAccount: user })}
          />
          </div>
          <div className="form-groupb">
          <label htmlFor="verificationCode" id='glow'>Enter Verification Code <br/></label>
            <input
              type="number"
              required
              className="form-control"
              id="verificationCode"
              value={form.verificationCode}
              onChange={(e) => updateForm({ verificationCode: e.target.value })}
          />
          </div>
            <br/>
            <div className="form-groups">
            <input
                type="submit"
                value="Add Device"
                className="btn btn-primary"
                />
                </div>
            </form>
            </div>
        </div>
    );
}