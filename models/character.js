const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CharacterSchema = new Schema({
  name: { type: String, required: true },
  imgUrl: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

module.exports = mongoose.model("Character", CharacterSchema);
