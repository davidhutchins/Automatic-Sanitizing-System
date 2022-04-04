import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './createacct.css';
import axios from 'axios';
 
export default function Create() {
 const [form, setForm] = useState({
   username: "",
   password: ""
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
  
  if(form.username === "" || form.password === "") {
    //throw an error and tell them to try again
    window.alert("Please enter a valid/nonempty username and password.");
    errorWithCreation = true;
    setForm({ username: "", password: ""});
  }
  if (form.username.includes(" "))
  {
    window.alert("Username contains whitespace. Please enter a valid username and password.");
    errorWithCreation = true;
    setForm({ username: "", password: ""});
  }

  //Grab all existing accounts and if a username already exists, throw an error
  const response = await axios.get('http://54.90.139.97/api/users/')
  const allAccounts = response.data;

  for (var i = 0; i < allAccounts.length; i++)
  {
    if (allAccounts[i].username === form.username)
    {
      window.alert("Username already taken. Please enter a different username.")
      errorWithCreation = true;
      setForm({ username: "", password: ""});
      break;
    }
  }

  if (!errorWithCreation)
  {
    // When a post request is sent to the create url, we'll add a new record to the database.
    const newPerson = { ...form };
  
    await fetch("http://54.90.139.97/api/users/add", {
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
      setForm({ username: "", password: ""});
      navigate("/");
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
      <div>

      <div id='heads'>
      <h1 className="bigHead" id='glow'>Create Account</h1>
        </div>
            <div id='moves'>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="username" id='glow' className="User">Username <br/></label>
          <input
            type="text"
            required
            className="form-control"
            id="username"
            value={form.username}
            onChange={(e) => updateForm({ username: e.target.value })}
            />
        </div>
        <br/>
        <div className="form-group">
          <label htmlFor="password" id='glow'>Password <br/></label>
          <input
            type="password"
            required
            className="form-control"
            id="password"
            value={form.password}
            onChange={(e) => updateForm({ password: e.target.value })}
          />
        </div>
        <br/>
        <div className="form-group">
          <input
            type="submit"
            value="Create Account"
            class="button"
            />
            </div>
          </form>
        </div>
      </div>
  );
}