let express = require("express");
let router = express.Router();

let user_controller = require("../controllers/userController");

router.post("/api/auth/signup", user_controller.signup);

router.post("/api/auth/login", function (req, res) {
  let userId = "string";
  let tokken = "string";
  res.send({ userId, tokken });
});

module.exports = router;
