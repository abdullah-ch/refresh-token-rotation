const express = require("express");
const authRouter = express.Router();
const { signupUser } = require("../controllers/auth");
const { userSignUpRules, validate } = require("../validations");

authRouter.post("/sign-up", userSignUpRules(), validate, signupUser);
module.exports = authRouter;
