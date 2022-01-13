const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());


//express.json utuluzes body parser, bodyparser.json is the same, depreciated tho
app.use(express.json());
require("dotenv").config({ path: "./config.env" });
app.use(require("./routes/stats"));


//sets the server port
const port = process.env.PORT || 2000;
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