import React from 'react';
import './levels.css'
import {Devices} from './battery';
import ProgressBar from 'react-bootstrap/ProgressBar'
import {Row, Col} from 'react-bootstrap';


function Levels() {
    return (
           <div id="page">
               <Devices/>
            
           </div>

    )
}

export default Levels;