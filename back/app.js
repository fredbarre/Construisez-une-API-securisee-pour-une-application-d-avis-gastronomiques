const express = require("express");
require("express-async-errors");

const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");
const env = require("./managers/env");
if (!env.PORT) console.log("PORT should be set in .env");
const { PORT = 3000 } = env;

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

app.listen(PORT, () => {
  console.log(`Server listen on http://localhost:${PORT}/`);
});

module.exports = app;
