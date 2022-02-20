import React from 'react';
import './homepage.css'
import Login from '../navbar/Login'
import { getUser } from "../navbar/Common"

function Home() {
   const loginText = (sessionStorage.getItem('token') === null) ? "Login to access your devices" : "Logged in as: " + getUser().name;
    return (
        <section id="Homepage">
                <section id="Titletxt">
                    <h1 id="headerText">Automatic Handle Cleaning System </h1>   
                    <h2 id='subtext'>{loginText}</h2> 
                </section>
                {Login()}

        </section>

    )
}

export default Home;