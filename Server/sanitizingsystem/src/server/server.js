const axios = require('axios').default;


require("dotenv").config({ path: "./config.env" });

const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const utils = require('./utils');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
app.use(express.json());
app.use(require("./routes/stats"));

//sets the server port
const port = process.env.PORT || 2000;

//Global variable to store account information
let userData;

//middleware that checks if JWT token exists and verifies it if it does exist.
//In all future routes, this helps to know if the request is authenticated or not.
app.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['authorization'];
  if (!token) return next(); //if no token, continue
 
  token = token.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    } else {
      req.user = user; //set the user to req so other routes can use it
      next();
    }
  });
});

// request handlers
app.get('/', (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Invalid user to access it.' });
  res.send('Logged in as: ' + req.user.username);
});

// validate the user credentials
app.post('/users/signin', async function (req, res) {

  const response = await axios.get('http://3.91.185.66/api/users/')
  const allAccounts = response.data;

  const user = req.body.username;
  const pwd = req.body.password;

  // return 400 status if username/password does not exist
  if (!user || !pwd) {
    return res.status(400).json({
      error: true,
      message: "Username or Password required."
    });
  }

  //find the user in the get request array
  for (let i = 0; i < allAccounts.length; i++)
  {
    if (allAccounts[i].username === req.body.username)
    {
      userData = {
        username: allAccounts[i].username,
        password: allAccounts[i].password,
        userId: allAccounts[i]._id,
        isAdmin: false
      };
    }
  }

  // return 401 status if the credentials do not match.
  if (user !== userData.username || pwd !== userData.password) {
    console.log("Username or Password is Wrong.");
    return res.status(401).json({
      error: true,
      message: "Username or Password is Wrong."
    });
  }
 
  // generate token
  console.log('Correct username/password. Generating token...')
  const token = utils.generateToken(userData);
  // get basic user details
  const userObj = utils.getCleanUser(userData);
  // return the token along with user details
  return res.json({ user: userObj, token });
});
 
 
// verify the token and return it if it's valid
app.get('/verifyToken', async function (req, res) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token;
  if (!token) {
    console.log('Token is required')
    return res.status(400).json({
      error: true,
      message: "Token is required."
    });
  }

  // check token that was passed by decoding token using secret
  jwt.verify(token, process.env.JWT_SECRET, async function (err, user) {
    if (err) {
      console.log('Invalid token')
      return res.status(401).json({
        error: true,
        message: "Invalid token."
      });

    }

    // return 401 status if the userId does not match.
    if (user.userId !== userData.userId) {
      console.log("Invalid user");
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    }
    // get basic user details
    var userObj = utils.getCleanUser(user);
    return res.json({ user: userObj, token });
  });
});

// get server to connect to
const dbaseConnection = require("./database/connector");
//listen for server requests
app.listen(port, () => {
  // perform a database connection when server starts
  dbaseConnection.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
