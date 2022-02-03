const React = require ('react')
var ReactDomServer = require('react-dom/server');
const express = require('express'); 
const app = express(); 
const port = process.env.PORT || 5000; 

// port listening
app.listen(port, () => console.log(`Listening on port ${port}`)); 

// sample get route
app.get('/express_backend', (req, res) => { 
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); 
}); 



app.get('/', (req, res) => { 
  const component = ReactDomServer.renderToString("ss");
  const html = `<h1> ${component}</h1>`;
  res.send(html); 
}); 