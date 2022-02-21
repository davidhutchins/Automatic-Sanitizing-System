import React from 'react';
import './homepage.css'
import Login from '../navbar/Login'
import { getUser, removeUserSession } from "../navbar/Common"
import Create from './createacct';

function LogOut() {
    
    const handleLogout = () => {
        removeUserSession();
        window.location.reload(true);
    }
    return (
        <div>
            <section id="page">
            <input type="button" onClick={handleLogout} value="Logout" />
            </section>
        </div>
    )
}

function Home() {
   const loginText = (sessionStorage.getItem('token') === null) ? "Login to access your devices" : "Logged in as: " + getUser().name;
   const renderLoginOrLogout = (sessionStorage.getItem('token') === null) ? Login() : LogOut();
    return (
        <section id="Homepage">
                <section id="Titletxt">
                    <h1 id="headerText">Automatic Handle Cleaning System </h1>   
                </section>
                    <h2 id='subtext'>{loginText}</h2> 
                {renderLoginOrLogout}
                {Create()}

        </section>

    )
}

export default Home;