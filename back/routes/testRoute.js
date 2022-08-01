let express = require("express");
let router = express.Router();

let auth = require("../middlewares/auth");
router.get("/auth", auth, (req, res) => {
  res.status(201).json(req.auth);
});

//router.get("/multer", user_controller.login);

module.exports = router;
