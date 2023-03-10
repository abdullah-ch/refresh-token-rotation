const {
  JWT_SECRET_ACCESS_TOKEN,
  JWT_SECRET_REFRESH_TOKEN,
  JWT_SECRET_ACCESS_TOKEN_TIME,
  JWT_SECRET_REFRESH_TOKEN_TIME,
} = process.env;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
  
  Generates a new hash using bcrypt.
  @param {string} password - Password to be hashed.
  @returns {string|false} - Returns the hashed password or false if there's an error.
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
  
  Trims and converts the input string to lowercase.
  @param {string} str - String to be trimmed and converted to lowercase.
  @returns {string} - Returns the trimmed and lowercase string.
  */
const trimLowerCaseString = (str) => str.toLowerCase().replace(/\s+/g, "");
/**
  
  Checks if the provided password matches the provided hash using bcrypt.
  @param {string} password - Password to be checked.
  @param {string} hash - Hash to be compared against.
  @returns {Promise<boolean>} - Returns a promise to be either resolved with the comparison result or rejected with an error.
  */
const checkPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
/**
  
  Generates a pair of access and refresh tokens using JSON Web Tokens.
  @param {object} userInfo - User information to be stored in the token.
  @returns {object} - Returns an object containing the access and refresh tokens.
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

/**
  
  Decodes a JSON Web Token to extract the user information.
  @param {string} token - Token to be decoded.
  @param {string} secret - Secret used to sign the token.
  @returns {object} - Returns an object containing the decoded user information.
  @throws - Throws an error if there's a problem decoding the token.
  */
const extractUser = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.log("error ===> extractUser ", error);
    throw error;
  }
};
/**
  
  Decodes a JSON Web Token to extract the user information.
  @param {string} token - Token to be decoded.
  @param {string} secret - Secret used to sign the token.
  @returns {object|null} - Returns an object containing the decoded user information, or null if the token is invalid or has expired.
  */
const decodeUser = (token, secret) => {
  return jwt.decode(token, secret);
};
module.exports = {
  generatePassword,
  trimLowerCaseString,
  checkPassword,
  generateTokenSet,
  extractUser,
  decodeUser,
};
