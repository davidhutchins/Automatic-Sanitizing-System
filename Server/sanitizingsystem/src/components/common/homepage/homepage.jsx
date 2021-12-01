import React, { useEffect } from 'react';
import './homepage.css'
import Button from 'react-bootstrap/Button'
import ProgressBar from 'react-bootstrap/ProgressBar'

function Home() {
   
    return (
       <div id="homepageContent">
           <h1 id="headerText">Automatic Hand Sanitizing System  <br/> &emsp; &emsp; World Class Cleanliness</h1>
       <div id="btn-cntdev">
       <button type="button" class="btn-info">Connect Device</button>
           </div>
       </div>


    )
}

export default Home;