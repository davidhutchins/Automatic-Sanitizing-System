import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './homepage.css';
import axios from 'axios';
import { getUser } from "../navbar/Common"
 
export default function AddDevice() {
 const [form, setForm] = useState({
   Device: ""
 });

 const navigate = useNavigate()
 
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
  
  if(form.Device === "") {
    //throw an error and tell them to try again
    window.alert("Please enter a valid device name.");
    errorWithCreation = true;
    setForm({Device: ""});
  }
  if (form.Device.includes(" "))
  {
    window.alert("Device name contains whitespace. Please enter a valid device name.");
    errorWithCreation = true;
    setForm({Device: ""});
  }

  //TODO: Add an edge case to prevent same user from adding the same device

  if (!errorWithCreation)
  {
    // When a post request is sent to the create url, we'll add a new record to the database.
    const newPerson = { ...form };
    const username = getUser().username;

    // useEffect(() => {
    //   const resp = await axios.post(`http://localhost:2000/handleData?deviceId=${parseInt(form.Device)}`);
    // })

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

      window.alert(`Device successfully added for ${username}!`);
      setForm({Device: ""});
      navigate("/");
    }
  }

    // This following section will display the form that takes the input from the user.
    return (
        <div>
        <div id='deviceAdd'>
            <h3  id='glow'>Add Device</h3>
        </div>
        <div id='moveit'>
        <form onSubmit={onSubmit}>
            <div className="form-group">
            <label htmlFor="deviceName" id='glow' className="User">Choose a Device to add <br/></label>
            <input
                type="text"
                required
                className="form-control"
                id="Device"
                value={form.Device}
                onChange={(e) => updateForm({ Device: e.target.value })}
                />
            </div>
            <br/>
            <div className="form-group">
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