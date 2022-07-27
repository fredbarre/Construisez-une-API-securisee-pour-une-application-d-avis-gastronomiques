const mongoose = require("mongoose");

const DBLINK = process.env.DBLINK;

const statusDB = mongoose.connect(DBLINK, function (err) {
  if (err) {
    throw err;
  }
});

module.exports = statusDB;
