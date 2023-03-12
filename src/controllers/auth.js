const {
  getUserByEmail,
  saveUser,
  assignRefreshTokenToUser,
  replaceRefreshTokenUser,
  removeRefreshTokenUser,
} = require('../services/user');
const {
  generatePassword,
  trimLowerCaseString,
  checkPassword,
  generateTokenSet,
  extractUser,
} = require('../utils');
const { refreshTokenReuseDetection } = require('../utils/auth');

const signupUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const isUser = await getUserByEmail(email);
    if (isUser) {
      return res.status(400).send({ errors: ['Email is already taken !'] });
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
          message: 'Account Created Successfully !',
          data: savedUser,
        });
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    return res.status(500).send({
      errors: [error],
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
        error: 'User does not exist',
      });

    if (!(await checkPassword(password, user.password))) {
      return res.status(400).send({
        error: 'Email or Password is not correct',
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

    res.cookie('refreshToken', refreshToken, {
      maxAge: process.env.JWT_COOKIE_EXPIRY_TIME * 1000,
      secure: true,
      httpOnly: true, // The cookie only accessible by the web server,
      sameSite: 'none',
    });

    return res.status(200).send({
      accessToken: accessToken,
      message: 'Logged In Successfully !',
    });
  } catch (error) {
    console.log('ERRROR ===> error ', error);
    return res.status(500).send({
      error: error,
    });
  }
};

const refreshTokenSets = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.clearCookie('refreshToken');
      return res.status(403).send({
        message: 'No Refresh Token Found !',
      });
    }

    const decodedUser = extractUser(
      refreshToken,
      process.env.JWT_SECRET_REFRESH_TOKEN
    );

    req.user = decodedUser;
    console.log('DECODED USER ====> refreshTokenSets ', req.user);

    const isHacker = await refreshTokenReuseDetection(
      decodedUser,
      refreshToken,
      res
    );

    if (isHacker) {
      console.log('This user has been hacked, returning ===> ');
      return;
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
        'updatedRefreshToken ====> replaceRefreshTokenUser ===>  ',
        updatedRefreshToken
      );

      res.cookie('refreshToken', tokenSet.refreshToken, {
        maxAge: process.env.JWT_COOKIE_EXPIRY_TIME * 1000,
        secure: true,
        httpOnly: true, // The cookie only accessible by the web server,
        sameSite: 'none',
      });

      return res.status(200).send({
        accessToken: tokenSet.accessToken,
      });
    }
  } catch (error) {
    handleRefreshTokenError(error, req, res);
  }
};

const logOut = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken');

    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(403).send({
        message: 'No Refresh Token Found !',
      });
    }

    const decodedUser = extractUser(
      refreshToken,
      process.env.JWT_SECRET_REFRESH_TOKEN
    );

    console.log('DECODED USER ====> logOut ', decodedUser);

    const isHacker = await refreshTokenReuseDetection(
      decodedUser,
      refreshToken,
      res
    );

    if (isHacker) {
      console.log('This user has been hacked, returning ===> ');
      return;
    }

    // remove verified refreshToken From Users RT List
    await removeRefreshTokenUser(decodedUser.id, refreshToken);
    return res.sendStatus(204);
  } catch (error) {
    handleRefreshTokenError(error, req, res);
  }
};
module.exports = {
  signupUser,
  loginUser,
  refreshTokenSets,
  logOut,
};
