import React from 'react';
import './homepage.css'
import Login from '../navbar/Login'

function Home() {
   
    return (
        <section id="Homepage">
                <section id="Titletxt">
                    <h1 id="headerText">Automatic Handle Cleaning System </h1>   
                    <h2 id='subtext'>Login to access your devices</h2> 
                </section>
                {Login()}

        </section>

    )
}

export default Home;