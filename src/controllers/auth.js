const {
  getUserByEmail,
  saveUser,
  updateUserById,
  assignRefreshTokenToUser,
  findUserRefreshToken,
  removeRefreshTokensUser,
  replaceRefreshTokenUser,
  removeRefreshTokenUser,
} = require("../services/user");
const {
  generatePassword,
  trimLowerCaseString,
  checkPassword,
  generateTokenSet,
  extractUser,
  decodeUser,
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
      maxAge: 60 * 60 * 1000,
      secure: true,
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

const refreshTokenSets = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.clearCookie("refreshToken");
      return res.status(403).send({
        message: "No Refresh Token Found !",
      });
    }

    const decodedUser = extractUser(
      refreshToken,
      process.env.JWT_SECRET_REFRESH_TOKEN
    );

    req.user = decodedUser;
    console.log("DECODED USER ====> refreshTokenSets ", req.user);

    const refreshTokenFound = await findUserRefreshToken(
      decodedUser.id,
      refreshToken
    );
    // RT is verified but is not present in the Database
    // it's a hacker

    if (!refreshTokenFound) {
      console.log(
        "RT is verified but is not present in the database ===> A Hacker is sending this token !!!"
      );
      await removeRefreshTokensUser(decodedUser.id);
      res.clearCookie("refreshToken");
      return res.status(403).send({
        message: "Refresh Token is invalid !",
      });
    }

    // generate new Tokens (access Token and refresh Token) and
    // update the RT with this request with newly created RT from the token set
    // created

    const tokenSet = generateTokenSet({
      name: decodedUser.name,
      id: decodedUser.id,
      email: decodedUser.email,
    });

    const updatedRefreshToken = await replaceRefreshTokenUser(
      decodedUser.id,
      refreshToken,
      tokenSet.refreshToken
    );

    if (updatedRefreshToken) {
      console.log(
        "updatedRefreshToken ====> replaceRefreshTokenUser ===>  ",
        updatedRefreshToken
      );

      res.cookie("refreshToken", tokenSet.refreshToken, {
        maxAge: 60 * 60 * 1000,
        secure: true,
        httpOnly: true, // The cookie only accessible by the web server
      });

      return res.status(200).send({
        accessToken: tokenSet.accessToken,
      });
    }
  } catch (error) {
    const { refreshToken } = req.cookies;
    let updatedUser = null;
    res.clearCookie("refreshToken");

    const decodedUser = decodeUser(
      refreshToken,
      process.env.JWT_SECRET_REFRESH_TOKEN
    );

    console.log("decodedUser ===> without verifying ===> ", decodedUser);

    // remove expired refreshToken From Users RT List
    if (decodedUser) {
      updatedUser = await removeRefreshTokenUser(decodedUser.id, refreshToken);
    }

    console.log("ERRROR ===> error ===> refreshTokenSets ", error.message);
    if (error?.message === "jwt expired") {
      if (updatedUser) {
        console.log("updatedUser ===> ", updatedUser);
        return res.status(403).send({
          message: "Refresh Token has expired !",
        });
      }
    } else if (error?.message === "jwt malformed") {
      return res.status(403).send({
        message: "Refresh Token is malformed !",
      });
    }

    return res.status(500).send({
      error: error,
    });
  }
};

const logOut = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken");

    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(403).send({
        message: "No Refresh Token Found !",
      });
    }

    const decodedUser = extractUser(
      refreshToken,
      process.env.JWT_SECRET_REFRESH_TOKEN
    );

    console.log("DECODED USER ====> logOut ", decodedUser);

    const refreshTokenFound = await findUserRefreshToken(
      decodedUser.id,
      refreshToken
    );

    // RT is verified but is not present in the Database
    // it's a hacker

    if (!refreshTokenFound) {
      console.log(
        "RT is verified but is not present in the database ===> A Hacker is sending this token !!!"
      );
      await removeRefreshTokensUser(decodedUser.id);
      return res.status(403).send({
        message: "Refresh Token is invalid !",
      });
    }

    // remove verified refreshToken From Users RT List
    await removeRefreshTokenUser(decodedUser.id, refreshToken);
    return res.sendStatus(204);
  } catch (error) {
    res.clearCookie("refreshToken");

    const { refreshToken } = req.cookies;
    let updatedUser = null;

    const decodedUser = decodeUser(
      refreshToken,
      process.env.JWT_SECRET_REFRESH_TOKEN
    );
    console.log("decodedUser ===> without verifying ===> ", decodedUser);

    // remove expired refreshToken From Users RT List
    if (decodedUser) {
      updatedUser = await removeRefreshTokenUser(decodedUser.id, refreshToken);
    }

    console.log("ERRROR ===> error ===> logOut ", error.message);

    if (error?.message === "jwt expired") {
      if (updatedUser) {
        console.log("updatedUser ===> ", updatedUser);
        return res.status(403).send({
          message: "Refresh Token has expired !",
        });
      }
    } else if (error?.message === "jwt malformed") {
      return res.status(403).send({
        message: "Refresh Token is malformed !",
      });
    }

    return res.status(403).send({
      error: error,
    });
  }
};
module.exports = {
  signupUser,
  loginUser,
  refreshTokenSets,
  logOut,
};
