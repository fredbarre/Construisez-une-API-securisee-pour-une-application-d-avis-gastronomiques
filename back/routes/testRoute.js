let express = require("express");
let router = express.Router();

let auth = require("../middlewares/auth");
const multerMW = require("../middlewares/multer-config");
router.get("/auth", auth, (req, res) => {
  res.status(201).json(req.auth);
});

router.get("/multer", multerMW, (req, res) => {
  console.log(req);
  const { file, body } = req;
  res.status(201).json({ file, body });
});

module.exports = router;
