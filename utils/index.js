const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

/**
 ** Executes the validation request and returns a JSON response.
 * @param  {object} body
 */
const validationResponse = (body) => {
  validationResult(body).throw();
};

/**
 ** Generates a new password.
 * @param  {string} password
 */
const generatePassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    return newPassword;
  } catch (error) {
    console.log("here in error ==> utils ==> ", error.message);
    return false;
  }
};

module.exports = {
  generatePassword,
  validationResponse,
};
