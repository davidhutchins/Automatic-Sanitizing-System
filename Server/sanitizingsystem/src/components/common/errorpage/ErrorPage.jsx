import React from 'react';
import './ErrorPage.css'
 
function ErrorPage(props) { 
  return (
    <section>
      <div id="errorMessage">
        <br />
        <h1>Error! Not logged in!</h1>
        <br /><br />
      </div>
      <br /><br />
      <div id="directionMessage">
        <h2>Please navigate back to the homepage to create an account and log into the website.</h2>
      </div>
    </section>
  );
}
 
export default ErrorPage;