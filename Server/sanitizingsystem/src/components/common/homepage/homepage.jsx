import React from 'react';
import './homepage.css'
import Login from '../navbar/Login'
import { getUser, removeUserSession } from "../navbar/Common"
import AddDevice from './addDevice';

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function LogOut() {
    
    const handleLogout = () => {
        removeUserSession();
        window.location.reload(true);
    }
    return (
        <div>
            <section id="page">
            <input type="button" class="button" onClick={handleLogout} value="Logout" />
            </section>
        </div>
    )
}

function Home() {
   const loginText = (sessionStorage.getItem('token') === null) ? "Login to access your devices" : "Logged in as: " + getUser().username;
   const renderLoginOrLogout = (sessionStorage.getItem('token') === null) ? Login() : LogOut();
   const renderAddDevice = ((sessionStorage.getItem('token') === null) ? <div/> : AddDevice());
    return (
        <section id="Homepage">
                <section id="Titletxt">
                    <h1 id="headerText">Automatic Handle Cleaning System</h1>   
                </section>
                <section id='login'>
                    <h2 id='subtext'>{loginText}</h2> 
                </section>
                {renderLoginOrLogout}
                
                <section id="device">
                {renderAddDevice}
                </section>
        </section>
    )
}



export default Home;