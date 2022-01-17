const { MongoClient } = require("mongodb");
const DBURI = process.env.DB_CON;
const client = new MongoClient(DBURI, { useNewUrlParser: true, useUnifiedTopology: true, });
 
 
var database;
 
module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, dbConns) {
      // Verify we got a good "db" object
      if (dbConns)
      {
        database = dbConns.db("uss-sanitizer");
        console.log("Successfully connected to MongoDB."); 
      }
      return callback(err);
         });
  },
 
  //returns the server
  returnDatabase: function () {
    return database;
  },
};