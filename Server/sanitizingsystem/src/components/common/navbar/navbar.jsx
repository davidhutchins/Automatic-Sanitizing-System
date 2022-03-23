import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken, removeUserSession, setUserSession } from './Common';
import './navbar.css'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";
import{Levels, Home, Stats, Data, Create} from '../../common';
import GUIDE from '../../../components/setup.pdf'

import Login from './Login';
import ErrorPage from '../errorpage/ErrorPage';
import { userToken } from '../stats/stats';


function Navbar() {
  // let navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(true);
 
  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }
 
    axios.get(`http://54.90.139.97/api/verifyToken?token=${token}`).then(response => {
      setUserSession(response.data.token, response.data.user);
      setAuthLoading(false);
    }).catch(error => {
      removeUserSession();
      setAuthLoading(false);
    });
  }, []);
 
  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>
  }
  console.log(userToken);
  let ifNoAuth = (userToken === null) ? "/error" : "/stats";
  return (
    <section>
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/" className="link" onClick={() => window.href.reload(true)}> Home </Link>
            </li>
            <li>
              <Link to="/createAccount" className="link">Create Account</Link>
            </li>
            <li>
              <Link to={ifNoAuth} onClick={() => window.href.reload(true)} className="link">Sanitizing Statistics</Link>
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
      <Route path="/error" element={<ErrorPage/>}/>
      <Route path="/createAccount" element={<Create/>}/>
      <Route path="/guide" component={() => {window.location.href = {GUIDE} 
          return null;
        }}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
      </div>
    </Router>
  </section>

  )}

export default Navbar;