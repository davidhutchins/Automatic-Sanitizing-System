const express = require("express");

// stats is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const stats = express.Router();

// This will help us connect to the database
const dbConn = require("../database/connector");


// Gets a list of everything under the data collection
stats.route("/data").get(function (req, res) {
  let db_connect = dbConn.returnDatabase("uss-sanitizer");
  db_connect
    .collection("data")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});


stats.route("/weekdata").get(function (req, res) {
  let db_connect = dbConn.returnDatabase("uss-sanitizer");
  db_connect
    .collection("weekdata")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});




module.exports = stats;