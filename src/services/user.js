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
 * This function assigns a refresh token to a user in the database.
 * @param {string} id - The ID of the user to update.
 * @param {string} refreshToken - The refresh token to assign to the user.
 * @returns {object} - An object containing information about the update.
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
 * This function retrieves specific details about a user from the database.
 * @param {string} id - The ID of the user to retrieve.
 * @param {object} details - An object specifying the details to retrieve.
 * @returns {object} - An object containing the specified user details.
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

/**
 * This function finds a user in the database by their ID and a given refresh token.
 * @param {string} id - The ID of the user to search for.
 * @param {string} refreshToken - The refresh token to search for.
 * @returns {object} - An object containing the user's refresh token.
 */
const findUserRefreshToken = async (id, refreshToken) => {
  const userRefreshToken = await userModel.findOne({
    _id: id,
    refreshToken: {
      $in: [refreshToken],
    },
  });

  return userRefreshToken;
};

/**
 * This function removes all refresh tokens from a user in the database.
 * @param {string} id - The ID of the user to update.
 * @returns {object} - An object containing information about the update.
 */
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

/**
 * This function replaces a user's old refresh token with a new one in the database.
 * @param {string} id - The ID of the user to update.
 * @param {string} oldRefreshToken - The old refresh token to replace.
 * @param {string} newRefreshToken - The new refresh token to assign to the user.
 * @returns {object} - An object containing information about the update.
 */
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

/**
 * This function removes a specific refresh token from a user in the database.
 * @param {string} id - The ID of the user to update.
 * @param {string} refreshToken - The refresh token to remove from the user.
 * @returns {object} - An object containing information about the update.
 */
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
