const express = require("express");
const { getUserInformation } = require("../controllers/user");
const { verifyToken } = require("../middlewares/auth");
const userRouter = express.Router();

userRouter.get("/", verifyToken, getUserInformation);
module.exports = userRouter;
