const express = require("express");
const {
  lanaDelReySongs,
  taylorSwiftSongs,
  randomArtistsSongs,
} = require("../controllers/song");
const { verifyToken } = require("../middlewares/auth");
const songRouter = express.Router();

songRouter.get("/lana-del-rey", verifyToken, lanaDelReySongs);
songRouter.get("/taylor-swift", verifyToken, taylorSwiftSongs);
songRouter.get("/random", verifyToken, randomArtistsSongs);

module.exports = songRouter;
