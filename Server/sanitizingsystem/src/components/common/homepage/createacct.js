import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './homepage.css';
 
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
   e.preventDefault();
    if(form.username === "" || form.password === ""){
        //throw an error and tell them to try again
        window.alert("Please enter a valid/nonempty username and password");
    }        
    // When a post request is sent to the create url, we'll add a new record to the database.
   const newPerson = { ...form };
 
   await fetch("http://localhost:2000/users/add", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newPerson),
   })
   .catch(error => {
     window.alert(error);
   });
 
   setForm({ username: "", password: ""});
   navigate("/");
 }
 
 // This following section will display the form that takes the input from the user.
 return (
     <div>

     <div id='title'>
     <h3  id='glow'>Create Account</h3>
        </div>
           <div id='move'>
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
           type="text"
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
           className="btn btn-primary"
           />
       </div>
     </form>
   </div>
           </div>
 );
}