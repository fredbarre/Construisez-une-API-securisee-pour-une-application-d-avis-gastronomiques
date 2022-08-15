const express = require("express");
require("express-async-errors");

const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev", { immediate: false }));
app.use(morgan("dev", { immediate: true }));
app.use(require("./middlewares/cors"));
app.use(express.static("images"));
app.use("/", require("./routes/userRoute"));
app.use("/", require("./routes/sauceRoute"));
app.use("/test", require("./routes/testRoute")); //test route auth
app.use(require("./middlewares/error"));

module.exports = app;
