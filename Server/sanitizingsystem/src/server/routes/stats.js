// import { getUser } from "../../components/common/navbar/Common";
// const username = String(getUser().username);

const express = require("express");
const { ObjectId } = require("mongodb").ObjectId;

// stats is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const stats = express.Router();

// This will help us connect to the database
const dbConn = require("../database/connector");

//Deprecated
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

//get specific collections depending on deviceId
stats.route("/handleData").get(function (req, res) {
  let db_connect = dbConn.returnDatabase("uss-sanitizer");
  let deviceId = parseInt(req.query.deviceId);
  db_connect
    .collection("handleData")
    .find({deviceId: deviceId})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

//get all collections from database
stats.route("/handleData/all").get(function (req, res) {
  let db_connect = dbConn.returnDatabase("uss-sanitizer");
  db_connect
    .collection("handleData")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

stats.route("/users").get(function (req, res) {
  let db_connect = dbConn.returnDatabase("uss-sanitizer");
  db_connect
      .collection("users")
      .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// //Bronte- idk what this is for
// //Add user account to a device
// stats.route("/addDevice").put(function(req, res) {
//   let db_connect = dbConn.returnDatabase("uss-sanitizer")
//   let deviceId = parseInt(req.query.deviceId);
//   db_connect
//     .collection("handleData")
//     .find({deviceId: deviceId})
//     .toArray(function (err, result) {
//       if (err) throw err;
//       res.json(result);
//     });
// });

// creates new user
stats.route("/users/add").post(function (req, response) {
  let db_connect = dbConn.returnDatabase("uss-sanitizer");
  let myobj = {
    username: req.body.username,
    password: req.body.password,
  };
  db_connect.collection("users").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});



//Deprecated,
stats.route("/weekdata").get(function (req, res) {
  let deviceId = parseInt(req.query.deviceId);
  let db_connect = dbConn.returnDatabase("uss-sanitizer");
  db_connect
    .collection("weekdata")
    .find({deviceId: deviceId})
    .toArray(function (err, result) {
      if (err) throw err;

      db_connect
        .updateOne({deviceId: deviceId}, {$set: {
          linkedAccount: sessionStorage.getItem('user').username
        }})
      res.json(result);
      res.send('User account successfully linked.')
    });
});

// async function getDeviceData(deviceId)
// {
//   const res = await axios.put(`localhost:2000/handleData?deviceId=${deviceId}`);
//   return res.data;
// }

stats.route("/handleData/add").put(async function (req, response) {
  let deviceId = parseInt(req.body.deviceId);
  let db_connect = dbConn.returnDatabase("uss-sanitizer");
  let myobj = {
    deviceId: deviceId,
    lifetimeInteractions: 0,
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    // well, this does add a null user lmao req.body.username
    linkedAccount:  [req.body.linkedAccount],
    // linkedAccount: sessionStorage.getItem('user').username,
    verificationCode: "",
  };
  const foundData = await db_connect.collection("handleData").findOne({deviceId: deviceId});
  console.log(foundData);
  if (foundData)
  {
    let allLinkedAccounts = foundData.linkedAccount;
    let accountAlreadyExists = false;
    for (let i = 0; i < allLinkedAccounts.length; i++)
    {
      if (req.body.linkedAccount === allLinkedAccounts[i])
      {
        accountAlreadyExists = true;
        break;
      }
    }
    if (!accountAlreadyExists) {
      allLinkedAccounts.push(req.body.linkedAccount);
    }
    
    db_connect.collection("handleData").updateOne({deviceId:deviceId}, {$set: {
      linkedAccount: allLinkedAccounts
    }});
    response.send('User successfully linked.');
    console.log(req.body);
  }
  else
  {
    db_connect.collection("handleData").insertOne(myobj, function(err, res) {
      if (err) throw err;
      response.json(res);
    })
  }
});

// This section will help you get a single record by id
stats.route("/users/:id").get(function (req, res) {
  let db_connect = dbConn.returnDatabase("uss-sanitizer");
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("users")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

stats.route("/updateInteractions").get(function (req, res) {
  const d = new Date();
  let day = d.toLocaleDateString('en-US', { weekday: 'long' });

  let db_connect = dbConn.returnDatabase("uss-sanitizer");
  let deviceId = parseInt(req.query.deviceId);

  let newGrmsKild = -1;
  
  db_connect
    .collection("handleData")
    .find({deviceId: deviceId})
    .toArray(function (err, result) {
      if (err) throw err;

      if (result[0] == null) {
        res.send("Invalid device ID");
        return;
      } 
      
      newGrmsKild = result[0].lifetimeInteractions + 1;

      db_connect
      .collection("handleData")
      .updateOne({deviceId: deviceId}, {$set: {lifetimeInteractions: newGrmsKild}});

      //Update week data
      db_connect
      .collection("handleData")
      .find({deviceId: deviceId})
      .toArray(function (err, resultweekdays) {
        if (err) throw err;

        let weekdays = resultweekdays[0];
        weekdays[day] = weekdays[day] + 1;

        db_connect
       .collection("handleData")
       .updateOne({deviceId: deviceId}, {$set: {
            deviceId : deviceId,
            Sunday:    weekdays["Sunday"], 
            Monday:    weekdays["Monday"], 
            Tuesday:   weekdays["Tuesday"], 
            Wednesday: weekdays["Wednesday"], 
            Thursday:  weekdays["Thursday"], 
            Friday:    weekdays["Friday"], 
            Saturday:  weekdays["Saturday"]
        }});
      });

      res.send('Interactions updated successfully');
    });
});

stats.route("/ping").get(function (req, res) {
  res.send('pong');
});

module.exports = stats;