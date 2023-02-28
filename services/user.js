const { userModel } = require("../mongodb/model");

/**
 ** Gets a user by their email address.
 * @param  {string} userEmail
 */
const getUserByEmail = async (userEmail) => {
  const user = await userModel.findOne({ email: userEmail });
  return user;
};

/**
 ** Saves a new user.
 * @param  {object} userPayload
 */
const saveUser = async (userPayload) => {
  const user = new userModel(userPayload);
  return user
    .save()
    .then((user) => {
      return user;
    })
    .catch((err) => {
      return err.message;
    });
};

module.exports = {
  getUserByEmail,
  saveUser,
};
