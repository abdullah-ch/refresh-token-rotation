const getUserInformation = async (req, res, next) => {
  try {
    console.log("CURRENT USER INFORMATION =====> ");
    return res.status(200).send({
      user: "User Details =======>",
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
