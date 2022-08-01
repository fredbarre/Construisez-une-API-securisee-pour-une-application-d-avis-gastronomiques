const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");
let sauce_controller = require("../controllers/sauceController");

router.get("/api/sauces", auth, sauce_controller.getSauces);

router.get("/api/sauces/:id", auth, sauce_controller.getSauce);

router.post("/api/sauces", auth, multer, sauce_controller.newSauce);

router.put("/api/sauces/:id", auth, multer, sauce_controller.updateSauce);

router.delete("/api/sauces/:id", auth, sauce_controller.deleteSauce);

router.post("/api/sauces/:id/like", auth, sauce_controller.setLike);

module.exports = router;
