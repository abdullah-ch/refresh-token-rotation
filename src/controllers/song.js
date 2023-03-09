// This controller is a dummy controller, I wanted to create dummy APIs (that's the reason of this file's existence)....

const lanaDelReyDummyData = require("../json/lanaDelReySongs.json");
const taylorSwiftDummyData = require("../json/taylorSwiftSongs.json");
const randomSongs = require("../json/randomSongs.json");

const lanaDelReySongs = (req, res, next) => {
  return res.status(200).send({
    songs: Object.values(lanaDelReyDummyData),
  });
};

const taylorSwiftSongs = (req, res, next) => {
  return res.status(200).send({
    songs: Object.values(taylorSwiftDummyData),
  });
};

const randomArtistsSongs = (req, res, next) => {
  return res.status(200).send({
    songs: randomSongs,
  });
};
module.exports = {
  lanaDelReySongs,
  taylorSwiftSongs,
  randomArtistsSongs,
};
