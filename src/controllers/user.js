const { UN_AUTHORIZED } = require('../constants/errorCodes');
const { getSpecificDetailsUser } = require('../services/user');
const AppError = require('../utils/error');

const getUserInformation = async (req, res, next) => {
  try {
    const userDetails = await getSpecificDetailsUser(req.user.id, {
      name: 1,
      email: 1,
      _id: 0,
    });
    return res.status(200).send({
      user: userDetails,
    });
  } catch (error) {
    return next(
      new AppError({ message: 'Something went wrong !' }, UN_AUTHORIZED)
    );
  }
};

module.exports = {
  getUserInformation,
};
