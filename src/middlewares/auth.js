const { UN_AUTHENTICATED, UN_AUTHORIZED } = require('../constants/errorCodes');
const { extractUser } = require('../utils');
const AppError = require('../utils/error');

/**
 ** Verify User Token
 */
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  console.log('TOKEN ====> ', token);

  if (!token)
    next(
      new AppError(
        {
          message: 'No authorization token found',
        },
        UN_AUTHORIZED
      )
    );

  try {
    const decodedUser = extractUser(token, process.env.JWT_SECRET_ACCESS_TOKEN);
    req.user = decodedUser;
    return next();
  } catch (err) {
    next(new AppError({ message: 'Invalid Token' }, UN_AUTHENTICATED));
  }
};

module.exports = {
  verifyToken,
};
