const { validationResult } = require("express-validator");
const { getUserByEmail, saveUser } = require("../services/user");
const { generatePassword, validationResponse } = require("../utils");

const signupUser = async (req, res, next) => {
  //   cDonsole.log("SIGN UP ==========>");
  try {
    // console.log("req.body ===> ", req.body);
    const { email, password, name } = req.body;
    const isUser = await getUserByEmail(email);
    if (isUser) {
      return res.status(400).send({ message: "Email is already taken !" });
    }

    // create password hash
    const hashedPassword = await generatePassword(password);
    const user = {
      name,
      email,
      password: hashedPassword,
    };

    saveUser(user)
      .then((savedUser) => {
        return res.status(200).send({
          message: "Account Created Successfully !",
          data: savedUser,
        });
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
};

module.exports = {
  signupUser,
};
