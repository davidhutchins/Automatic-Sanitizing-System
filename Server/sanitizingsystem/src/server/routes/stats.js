const express = require("express");

// stats is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const stats = express.Router();



// This will help us connect to the database
const dbConn = require("../database/connector");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// This section will help you get a list of all the records.
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

// This section will help you get a single record by id
stats.route("/data/:doorsSanid").get(function (req, res) {
  let db_connect = dbConn.returnDatabase("uss-sanitizer");
  let myquery = { doorsSanid: ObjectId( req.params.doorsSanid )};
  db_connect
      .collection("data")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

stats.route("/data/:grmsKild").get(function (reqs, resx) {
  let db_connects = dbConn.returnDatabase("uss-sanitizer");
  let myquery = { grmsKild: ObjectId( reqs.params.grmsKild )};
  db_connects
      .collection("data")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        resx.json(result);
      });
});

module.exports = stats;