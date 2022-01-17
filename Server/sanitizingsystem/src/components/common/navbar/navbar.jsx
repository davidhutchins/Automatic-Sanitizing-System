import React from 'react';
import './navbar.css'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";
  import{Levels, Home, Stats, Data} from '../../common';
  import GUIDE from '../../../components/setup.pdf'

function Navbar() {
  return (
    <section id="router">
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/" className="link">Home</Link>
            </li>
            <li>
              <Link to="/stats" className="link">Sanitizing Statistics</Link>
            </li>
            <li>
              <Link to="/levels"className="link">Power Levels</Link>
            </li>
            <li>
              <Link to="/data"className="link">Data</Link>
            </li>
            <li>
              <Link to={GUIDE} target="_blank"className="link">Setup Guide</Link>
            </li>
          </ul>
        </nav>
    <Routes>
      <Route path="/stats" element={<Stats/>}/>
      <Route path="/levels" element={<Levels/>}/>
      <Route path="/data" element={<Data/>}/>
      <Route path="/" element={<Home/>}/>
      <Route path="/guide" component={() => {window.location.href = {GUIDE} 
          return null;
        }}/>
    </Routes>
      </div>
    </Router>
  </section>

  )}

export default Navbar;