const express = require("express");
const authRouter = express.Router();
const {
  signupUser,
  loginUser,
  refreshTokenSets,
} = require("../controllers/auth");
const { userSignUpRules, validate, userLogInRules } = require("../validations");

authRouter.post("/sign-up", userSignUpRules(), validate, signupUser);
authRouter.post("/login", userLogInRules(), validate, loginUser);
authRouter.get("/refresh-token", refreshTokenSets);

module.exports = authRouter;
