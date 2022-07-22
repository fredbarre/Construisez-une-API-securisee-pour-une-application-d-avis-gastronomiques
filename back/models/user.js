const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

let userModel = mongoose.model("user", userSchema);
module.exports = userModel;
//module.exports = mongoose.model("Thing", user);
