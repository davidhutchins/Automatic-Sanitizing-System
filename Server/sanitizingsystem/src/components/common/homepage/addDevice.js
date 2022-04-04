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
  let errorWithCreation = false;
  e.preventDefault();
  
  if (form.deviceId.includes(" "))
  {
    form.deviceId.trim();
  }

  if (form.verificationCode.length !== 6)
  {
    errorWithCreation = true;
  }
  
  //Add a case to reject when verification code does not match
  //Get all collections that matches verification code
  const verCodeRes = await axios.get(`http://localhost:2000/handleData/getVerificationCode?verificationCode=${form.verificationCode}`);
  const verCodeCollections = verCodeRes.data;
  console.log(verCodeCollections);

  //If the response is empty, that means no device ID matches the verification code
  if (verCodeCollections.length === 0)
  {
    errorWithCreation = true;
  }

  if (errorWithCreation)
  {
    window.alert("Device linking failed. Please try again.");
    setForm({ deviceId: "", verificationCode: ""});
  }

  else
  {
    const newPerson = { ...form };

    await fetch("http://localhost:2000/handleData/linkDevice", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPerson),
    })
    .catch(error => {
      window.alert(error);
    });

    window.alert("Device successfully linked!");
    setForm({ deviceId: "", verificationCode: ""});
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
                class="button"
                />
                </div>
            </form>
            </div>
        </div>
    );
}