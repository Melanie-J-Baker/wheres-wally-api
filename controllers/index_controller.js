exports.get_index = (req, res) => {
  res.json({
    msg: "Please go to /characters for characters or /game for the game",
  });
};
