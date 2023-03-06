const { userModel } = require("../mongodb/model");

/**
 ** fetches a user by its email.
 * @param  {string} userEmail
 * @returns {object} userDetails
 */
const getUserByEmail = async (userEmail) => {
  const user = await userModel.findOne({ email: userEmail });
  return user;
};

/**
 ** creates a new user.
 * @param  {object} userPayload
 * @returns {object} createdUser
 */
const saveUser = async (userPayload) => {
  const user = new userModel(userPayload);
  return user
    .save()
    .then((user) => {
      return user;
    })
    .catch((err) => {
      return err;
    });
};

/**
 ** updates a user.
 * @param  {string} id
 * @param  {object} userPayload
 * @returns {object} updation information
 */
const updateUserById = async (id, userPayload) => {
  const updatedUser = await userModel.updateOne(
    {
      _id: id,
    },
    userPayload
  );

  return updatedUser;
};

/**
 * finds and assigns refresh token to the user
 * @param {string} id
 * @param {string} refreshToken
 * @returns {object} updation information
 */
const assignRefreshTokenToUser = async (id, refreshToken) => {
  const updatedUser = await userModel.updateOne(
    {
      _id: id,
    },
    {
      $push: {
        refreshToken,
      },
    }
  );

  return updatedUser;
};

/**
 * finds User and only return those keys that are specified in the details parameter
 * @param {string} id
 * @param {object} details
 * @returns {object} userDetails
 */
const getSpecificDetailsUser = async (id, details) => {
  const userDetails = await userModel.findOne(
    {
      _id: id,
    },
    details
  );

  return userDetails;
};

const findUserRefreshToken = async (id, refreshToken) => {
  const userRefreshToken = await userModel.findOne({
    _id: id,
    refreshToken: {
      $in: [refreshToken],
    },
  });

  return userRefreshToken;
};

const removeRefreshTokensUser = async (id) => {
  const user = await userModel.updateOne(
    {
      _id: id,
    },
    {
      refreshToken: [],
    }
  );
  return user;
};

const replaceRefreshTokenUser = async (
  id,
  oldRefreshToken,
  newRefreshToken
) => {
  const updatedUser = await userModel.updateOne(
    {
      _id: id,
      refreshToken: oldRefreshToken,
    },
    {
      $set: {
        "refreshToken.$": newRefreshToken,
      },
    }
  );

  return updatedUser;
};

const removeRefreshTokenUser = async (id, refreshToken) => {
  const updatedUser = await userModel.updateOne(
    {
      _id: id,
    },
    {
      $pull: {
        refreshToken: refreshToken,
      },
    }
  );

  return updatedUser;
};
module.exports = {
  getUserByEmail,
  saveUser,
  updateUserById,
  assignRefreshTokenToUser,
  getSpecificDetailsUser,
  findUserRefreshToken,
  removeRefreshTokensUser,
  replaceRefreshTokenUser,
  removeRefreshTokenUser,
};
