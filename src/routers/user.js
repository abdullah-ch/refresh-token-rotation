const express = require("express");
const { getUserInformation } = require("../controllers/user");
const userRouter = express.Router();

userRouter.get("/", getUserInformation);
module.exports = userRouter;
