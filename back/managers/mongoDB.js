const mongoose = require("mongoose");

let env = require("../managers/env");
if (!env.DBLINK) throw new Error("DBLINK must be set in .env");
const DBLINK = env.DBLINK;

const statusDB = mongoose.connect(DBLINK, function (err) {
  if (err) {
    throw err;
  }
});

module.exports = statusDB;
