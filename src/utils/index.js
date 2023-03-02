const {
  JWT_SECRET_ACCESS_TOKEN,
  JWT_SECRET_REFRESH_TOKEN,
  JWT_SECRET_ACCESS_TOKEN_TIME,
  JWT_SECRET_REFRESH_TOKEN_TIME,
} = process.env;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

/**
 ** Executes the validation request and returns a JSON response.
 * @param  {object} body
 */
const validationResponse = (body) => {
  validationResult(body).throw();
};

/**
 ** Generates a new hash.
 * @param  {string} password
 * @return {string} hash
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

/**
 ** Trims and Converts the Input String to Lowercase.
 * @param  {string} str
 * @returns {string} str
 */
const trimLowerCaseString = (str) => str.toLowerCase().replace(/\s+/g, "");

/**
 * checks password
 * @param {string} password
 * @param {string} hash
 */

const checkPassword = async (password, hash) =>
  await bcrypt.compare(password, hash);

/**
 * generates access-token and refresh-token
 * @param {object} userInfo
 * @return {string} access-token and refresh-token
 */

const generateTokenSet = (userInfo) => {
  const accessToken = jwt.sign(userInfo, JWT_SECRET_ACCESS_TOKEN, {
    expiresIn: JWT_SECRET_ACCESS_TOKEN_TIME,
  });

  const refreshToken = jwt.sign(userInfo, JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: JWT_SECRET_REFRESH_TOKEN_TIME,
  });

  return {
    accessToken,
    refreshToken,
  };
};

const extractUser = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET_ACCESS_TOKEN);
  } catch (error) {
    console.log("error ===> ", error);
    throw error;
  }
};
module.exports = {
  generatePassword,
  validationResponse,
  trimLowerCaseString,
  checkPassword,
  generateTokenSet,
  extractUser,
};
