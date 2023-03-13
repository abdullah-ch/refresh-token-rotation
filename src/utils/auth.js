const { UN_AUTHORIZED, INTERNAL_SERVER } = require('../constants/errorCodes');
const {
  findUserRefreshToken,
  removeRefreshTokenUser,
  removeRefreshTokensUser,
} = require('../services/user');
const AppError = require('./error');

const { decodeUser } = require('./index.js');

/**
 * Checks if a given refresh token exists in the database for a given user.
 *
 * @param {object} decodedUser - The decoded user object.
 * @param {string} refreshToken - The refresh token string.
 * @param {object} res - The HTTP response object.
 * @returns {boolean} - Returns true if the refresh token does not exist in the database, false otherwise.
 */
const refreshTokenReuseDetection = async (decodedUser, refreshToken, res) => {
  const refreshTokenFound = await findUserRefreshToken(
    decodedUser.id,
    refreshToken
  );

  if (!refreshTokenFound) {
    console.log(
      'RT is verified but is not present in the database ===> A Hacker is sending this token !!!'
    );
    await removeRefreshTokensUser(decodedUser.id);
    res.clearCookie('refreshToken');
    next(
      new AppError(
        {
          message: 'Refresh Token is invalid !',
        },
        UN_AUTHORIZED
      )
    );

    return true;
  }

  return false;
};

/**
 * Handles errors related to invalid or expired refresh tokens.
 *
 * @param {Error} error - The error object.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {object} - An HTTP response object indicating the type of error that occurred.
 */
const handleRefreshTokenError = async (error, req, res) => {
  const { refreshToken } = req.cookies;
  let updatedUser = null;

  res.clearCookie('refreshToken');
  const decodedUser = decodeUser(
    refreshToken,
    process.env.JWT_SECRET_REFRESH_TOKEN
  );
  console.log('decodedUser ===> without verifying ===> ', decodedUser);

  // remove expired refreshToken From Users RT List
  if (decodedUser) {
    updatedUser = await removeRefreshTokenUser(decodedUser.id, refreshToken);
  }

  console.log('ERRROR ===> error ===> refreshTokenSets ', error.message);

  if (error?.message === 'jwt expired') {
    if (updatedUser) {
      console.log('updatedUser ===> ', updatedUser);
      return next(
        new AppError(
          {
            message: 'Refresh Token has expired !',
          },
          UN_AUTHORIZED
        )
      );
    }
  } else if (error?.message === 'jwt malformed') {
    return next(
      new AppError(
        {
          message: 'Refresh Token is malformed !',
        },
        UN_AUTHORIZED
      )
    );
  }

  return next(
    new AppError({ message: 'Something went wrong !' }, INTERNAL_SERVER)
  );
};

module.exports = {
  refreshTokenReuseDetection,
  handleRefreshTokenError,
};
