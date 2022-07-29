let express = require("express");
let router = express.Router();

let sauce_controller = require("../controllers/sauceController");

router.get("/api/sauces", sauce_controller.getSauces);

router.get("/api/sauces/:id", sauce_controller.getSauce);

router.post("/api/sauces", sauce_controller.newSauce);

router.put("/api/sauces/:id", sauce_controller.updateSauce);

router.delete("/api/sauces/:id", sauce_controller.deleteSauce);

router.post("/api/sauces/:id/like", sauce_controller.setLike);


module.exports = router;