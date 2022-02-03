const express = require("express");
const { ObjectId } = require("mongodb");

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
  let handleId = parseInt(req.query.handleId);
  let db_connect = dbConn.returnDatabase("uss-sanitizer");
  db_connect
    .collection("weekdata")
    .find({doorsSanid: handleId})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

stats.route("/updateInteractions").get(function (req, res) {
  const d = new Date();
  let day = d.toLocaleDateString('en-US', { weekday: 'long' });

  let db_connect = dbConn.returnDatabase("uss-sanitizer");
  let handleId = parseInt(req.query.handleId);

  let newGrmsKild = -1;
  
  db_connect
    .collection("data")
    .find({doorsSanid: handleId})
    .toArray(function (err, result) {
      if (err) throw err;

      if (result[0] == null) {
        res.send("Invalid device ID");
        return;
      } 
      
      newGrmsKild = result[0].grmsKild + 1;

      db_connect
      .collection("data")
      .updateOne({doorsSanid: handleId}, {$set: {grmsKild: newGrmsKild}});

      //Update week data
      db_connect
      .collection("weekdata")
      .find({doorsSanid: handleId})
      .toArray(function (err, resultweekdays) {
        if (err) throw err;

        let weekdays = resultweekdays[0];
        weekdays[day] = weekdays[day] + 1;

        db_connect
       .collection("weekdata")
       .updateOne({doorsSanid: handleId}, {$set: {
            doorsSanid : handleId,
            Sunday:    weekdays["Sunday"], 
            Monday:    weekdays["Monday"], 
            Tuesday:   weekdays["Tuesday"], 
            Wednesday: weekdays["Wednesday"], 
            Thursday:  weekdays["Thursday"], 
            Friday:    weekdays["Friday"], 
            Saturday:  weekdays["Saturday"]
        }});

      // db_connect
      //  .collection("weekdata")
      //  .insertOne({
      //       doorsSanid : handleId,
      //       Sunday:    10, 
      //       Monday:    80, 
      //       Tuesday:   40, 
      //       Wednesday: 60, 
      //       Thursday:  40, 
      //       Friday:    90, 
      //       Saturday:  30
      //   });
      
      });

      res.send('Interactions updated successfully');
    });
});


module.exports = stats;