const express = require("express");
const authRouter = express.Router();
const {
  signupUser,
  loginUser,
  refreshTokenSets,
  logOut,
} = require("../controllers/auth");
const { userSignUpRules, validate, userLogInRules } = require("../validations");

authRouter.post("/sign-up", userSignUpRules(), validate, signupUser);
authRouter.post("/login", userLogInRules(), validate, loginUser);
authRouter.get("/refresh", refreshTokenSets);
authRouter.get("/log-out", logOut);

module.exports = authRouter;
