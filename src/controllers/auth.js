const {
  getUserByEmail,
  saveUser,
  updateUserById,
  assignRefreshTokenToUser,
} = require("../services/user");
const {
  generatePassword,
  trimLowerCaseString,
  checkPassword,
  generateTokenSet,
} = require("../utils");

const signupUser = async (req, res, next) => {
  try {
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

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = trimLowerCaseString(email);
    const user = await getUserByEmail(trimmedEmail);

    if (!user)
      return res.status(400).send({
        error: "User does not exist",
      });

    if (!(await checkPassword(password, user.password))) {
      return res.status(400).send({
        error: "Email or Password is not correct",
      });
    }

    // creates JWT TOKEN SET
    const { accessToken, refreshToken } = generateTokenSet({
      name: user.name,
      id: user._id,
      email: user.email,
    });

    // Save Refresh Token To DATABASE and send Refresh Token as a cookie

    await assignRefreshTokenToUser(user._id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      maxAge: 60 * 60,
      httpOnly: true, // The cookie only accessible by the web server
    });

    return res.status(200).send({
      accessToken: accessToken,
      message: "Logged In Successfully !",
    });
  } catch (error) {
    console.log("ERRROR ===> error ", error);
    return res.status(500).send({
      error: error,
    });
  }
};
module.exports = {
  signupUser,
  loginUser,
};
