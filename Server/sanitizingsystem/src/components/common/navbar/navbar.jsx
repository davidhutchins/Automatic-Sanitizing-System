import React from 'react';
import './navbar.css'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";
  import{Levels, Home, Stats} from '../../common';
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
              <Link to={GUIDE} target="_blank"className="link">Setup Guide</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/stats">
            <Stats />
          </Route>
          <Route path="/levels">
            <Levels />
          </Route>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/guide" component={() => { 
     window.location.href = {GUIDE} 
     return null;
}}/>
        </Switch>
      </div>
    </Router>
       </section>

    )
}

export default Navbar;