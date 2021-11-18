import React from 'react';
import './levels.css'
import {Devices} from './battery';
import ProgressBar from 'react-bootstrap/ProgressBar'


function Levels() {
    return (
           <div id="Header">
               <Devices/>
           </div>

    )
}

export default Levels;