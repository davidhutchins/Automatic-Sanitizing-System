import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './homepage.css';
import axios from 'axios';
import { getUser } from "../navbar/Common"
 
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
 async function onSubmit(e) {
  let errorWithCreation = false;
  e.preventDefault();
  
  if(form.deviceId === "") {
    //throw an error and tell them to try again
    window.alert("Please enter a valid Device Id .");
    errorWithCreation = true;
    setForm({deviceId: ""});
  }
  if (form.deviceId.includes(" "))
  {
    window.alert("deviceId name contains whitespace. Please enter a valid Id.");
    errorWithCreation = true;
    setForm({deviceId: ""});
  }

  //TODO: Add an edge case to prevent same user from adding the same deviceId

  if (!errorWithCreation) {
    // When a post request is sent to the create url, we'll add a new record to the database.
      const newPerson = { ...form };
      const username = String(getUser().username);
      console.log(username);
      // const resp = await axios.put(
      //                               `http://localhost:2000/adddeviceId?deviceIdId=${parseInt(form.deviceId)}`, 
      //                               {
      //                                 linkedAccount: username
      //                               }
      //                             );

                                 
  
    await fetch("http://localhost:2000/handleData/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPerson),
      })
      .catch(error => {
        window.alert(error);
      });

      window.alert("Account successfully created! Redirecting to the homepage.");
      setForm({ deviceId: ""});
      navigate("/");
    // await fetch("http://54.90.139.97/api/users/add", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(newPerson),
    //   })
    //   .catch(error => {
    //     window.alert(error);
    //   });

      window.alert(`deviceId successfully added for ${username}!`);
    //  console.log(resp);
      setForm({deviceId: ""});
      navigate("/");
    }
  }

    // This following section will display the form that takes the input from the user.
    return (
        <div>
        <div id='deviceIdAdd'>
            <h3  id='glow'>Add Device</h3>
            <br/>
        </div>
        <div id='moveit'>
        <form onSubmit={onSubmit}>
            {/* <div className="form-groupa">
            <label htmlFor="deviceIdName" id='glow' className="User">deviceId Name <br/></label>
            <input
                type="text"
                required
                className="form-controls"
                id="deviceId"
                value={form.deviceId}
                onChange={(e) => updateForm({ deviceId: e.target.value })}
                />
            </div> */}
            <br/>
        <div className="form-groupa">
          <label htmlFor="deviceId" id='glow'>Enter Your Device's ID <br/></label>
          <input
            type="text"
            required
            className="form-control"
            id="deviceId"
            value={form.deviceId}
            onChange={(e) => updateForm({ deviceId: e.target.value, linkedAccount: user })}
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