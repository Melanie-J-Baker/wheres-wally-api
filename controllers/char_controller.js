const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Character = require("../models/character");
const he = require("he");

exports.get_chars = asyncHandler(async (req, res, next) => {
  const chars = await Character.find({}, "_id name imgUrl").exec();
  res.json(chars);
});

exports.get_char_coords = asyncHandler(async (req, res, next) => {
  const char = await Character.findById(req.params.id);
  let correctCoords = false;
  if (
    char.x <= req.body.x + 3 &&
    char.x >= req.body.x - 3 &&
    char.y >= req.body.y - 3 &&
    char.y <= req.body.y + 3
  ) {
    correctCoords = true;
  }
  res.json(correctCoords);
});

exports.post_chars = [
  body("name", "Name should not be empty")
    .trim()
    .isLength({ min: 1, max: 20 })
    .escape(),
  body("imgUrl", "Image URL should not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("x", "x value is required").trim().isLength({ min: 0 }).escape(),
  body("y", "y value is required").trim().isLength({ min: 0 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json(errors.array());
    const char = new Character({
      name: req.body.name,
      imgUrl: he.decode(req.body.imageUrl),
      x: req.body.x,
      y: req.body.y,
    });
    const savedChar = await char.save();
    return res.json(savedChar);
  }),
];

exports.delete_chars = asyncHandler(async (req, res, next) => {
  const deletedChars = await Character.deleteMany().exec();
  res.json(deletedChars);
});
