const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  start_time: { type: Number, default: parseInt(Date.now()), required: true },
  end_time: { type: Number, default: 0, required: true },
  player_name: { type: String, default: "Anon", required: true },
});

GameSchema.virtual("score").get(function () {
  return this.end_time - this.start_time;
});

module.exports = mongoose.model("Game", GameSchema);
