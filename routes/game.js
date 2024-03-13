const express = require("express");
const router = express.Router();
//const authAdmin = require("../middleware/authAdmin");

const game_controller = require("../controllers/game_controller");

router.get("/", game_controller.get_game);

router.post("/", game_controller.post_game);

router.patch("/:id/time", game_controller.patch_time);
router.patch("/:id/name", game_controller.patch_name);

router.delete("/", /*authAdmin,*/ game_controller.delete_games);

module.exports = router;
