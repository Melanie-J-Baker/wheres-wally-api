#! /usr/bin/env node

console.log(
  'This script populates a test game and characters to database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Game = require("./models/game");
const Character = require("./models/character");

const characters = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createGame();
  await createCharacters();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function characterCreate(index, name, imgUrl, x, y) {
  const characterdetail = { name: name, imgUrl: imgUrl, x: x, y: y };
  const character = new Character(characterdetail);

  await character.save();
  characters[index] = character;
  console.log(`Added character: ${name}`);
}

async function gameCreate(start_time, end_time, player_name) {
  const gamedetail = {
    start_time: start_time,
    end_time: end_time,
    player_name: player_name,
  };
  const game = new Game(gamedetail);
  await game.save();
  console.log(`Added game: ${player_name}`);
}

async function createGame() {
  console.log("Adding game");
  await gameCreate(Date.now(), 0, "Mel");
}

async function createCharacters() {
  console.log("Adding characters");
  await Promise.all([
    characterCreate(0, "Wally", "../../images/wally.jpeg", 46, 43),
    characterCreate(1, "Wendy", "../../images/wendy.jpeg", 32, 27),
    characterCreate(2, "Oddlaw", "../../images/oddlaw.jpeg", 3, 54),
    characterCreate(3, "Wizard", "../../images/wizard.jpeg", 96, 37),
  ]);
}
