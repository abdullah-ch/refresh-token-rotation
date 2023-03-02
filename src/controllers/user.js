const { getSpecificDetailsUser } = require("../services/user");

const getUserInformation = async (req, res, next) => {
  try {
    const userDetails = await getSpecificDetailsUser(req.user.id, {
      name: 1,
      email: 1,
      _id: 0,
    });
    return res.status(200).send({
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
};

module.exports = {
  getUserInformation,
};
