const { formatError } = require('../utils');
const AppError = require('../utils/error');

/**
 * Express middleware function that handles errors thrown during a request
 * lifecycle. Logs the error to console and sends a JSON response with the
 * error message and status code, formatted to a standardized format.
 *
 * @param {*} error - The error object thrown during request processing.
 * @param {*} req - The Express request object.
 * @param {*} res - The Express response object.
 * @param {*} next - The Express next middleware function.
 */
const errorHandler = (error, req, res, next) => {
  // console.log('ERROR ==> ', error);

  if (error instanceof AppError) {
    const formatedError = formatError(error.message);
    return res.status(error.statusCode).json({
      errors: formatedError,
    });
  }

  return res.status(500).send('Something went wrong');
};

module.exports = errorHandler;
