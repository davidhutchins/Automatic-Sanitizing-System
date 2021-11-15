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
       <section>
           <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/stats">Sanitizing Statistics</Link>
            </li>
            <li>
              <Link to="/levels">Power Levels</Link>
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
        </Switch>
      </div>
    </Router>
      <a href= {GUIDE} rel="noreferrer" target = "_blank" className="setup_guide">Setup Guide</a>
       </section>

    )
}

export default Navbar;