const express = require("express");
const authRouter = express.Router();
const { check } = require("express-validator");
const { signupUser } = require("../controllers/auth");

authRouter.post(
  "/sign-up",
  [
    // email express validator check
    check("email").isEmail().withMessage("Invalid Email Format"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 chars long"),
    check("name")
      .isString()
      .not()
      .isEmpty()
      .withMessage("Name cannot be empty"),
  ],
  signupUser
);
module.exports = authRouter;
