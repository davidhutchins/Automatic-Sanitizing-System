import React from 'react';
import './ErrorPage.css'
 
function ErrorPage(props) { 
  return (
    <section>
      <div id="errorMessage">
        <br />
        Error! Not logged in!
        <br /><br />
      </div>
      <br /><br />
      <div id="directionMessage">
        Please navigate back to the homepage to create an account and log into the website.
      </div>
    </section>
  );
}
 
export default ErrorPage;