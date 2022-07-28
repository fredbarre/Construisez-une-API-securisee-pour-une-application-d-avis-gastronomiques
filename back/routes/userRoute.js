let express = require("express");
let router = express.Router();

let user_controller = require("../controllers/userController");

router.post("/api/auth/signup", user_controller.signup);

router.post("/api/auth/login", user_controller.login);

module.exports = router;
