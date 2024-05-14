const express = require("express");
const router = express.Router();

const char_controller = require("../controllers/char_controller");

router.get("/", char_controller.get_chars);
router.post("/:id", char_controller.get_char_coords);
router.post("/", char_controller.post_chars);
router.delete("/", char_controller.delete_chars);

module.exports = router;
