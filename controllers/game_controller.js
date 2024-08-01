const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Game = require("../models/game");

exports.get_game = asyncHandler(async (req, res) => {
  // delete all games that are unplayed and older than a few minutes or so
  const unfinishedGames = await Game.find({ end_time: 0 }).exec();
  unfinishedGames.filter((game) => {
    if (game.start_time < Date.now() - 3600000) deleteGame(game._id);
  });
  const games = await Game.find().sort({ score: -1 }).exec();
  const finishedGames = games.filter((game) => game.end_time != 0);
  res.json(finishedGames);
});

exports.post_game = asyncHandler(async (req, res) => {
  const game = new Game({ start_time: parseInt(Date.now()) });
  const savedGame = await game.save();
  res.json(savedGame._id);
});

exports.patch_time = asyncHandler(async (req, res) => {
  // update game end time
  const game = await Game.findById(req.params.id).exec();
  if (game) {
    // prevent end time from being set more than once
    if (game.end_time == 0) {
      game.end_time = parseInt(Date.now());
    }
  }
  const patchedGame = await game.save();
  if (patchedGame) {
    res.json({ score: patchedGame.score });
  } else {
    res.json({ err: `Couldn't find game ({id: ${req.params.id}})` });
  }
});

exports.patch_name = [
  body("name", "Name is empty!").trim().isLength({ min: 1, max: 20 }).escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json(errors.array());
    const game = await Game.findById(req.params.id);
    if (game) {
      if (game.player_name == "Anon") {
        game.player_name = req.body.name;
      }
    } else {
      return res.json({ msg: `Couldn't find game ({id: ${req.params.id}})` });
    }
    const patchedGame = await game.save();
    if (patchedGame) {
      return res.json(patchedGame);
    } else {
      return res.json({ msg: `Couldn't find game ({id: ${req.params.id}})` });
    }
  }),
];

exports.delete_games = asyncHandler(async (req, res) => {
  const deletedGames = await Game.deleteMany({}).exec();
  res.json(deletedGames);
});

const deleteGame = async (id) => {
  await Game.findByIdAndDelete(id);
};
