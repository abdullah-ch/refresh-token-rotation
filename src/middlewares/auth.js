const { extractUser } = require("../utils");

/**
 ** Verify User Token
 */
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token)
    return res.status(403).send({ data: "No authorization token found" });
  try {
    const decodedUser = extractUser(token.split(" ")[1]);
    req.user = decodedUser;
    return next();
  } catch (err) {
    console.log(err.message);
    return res.status(401).send({ data: "Invalid Token" });
  }
};

module.exports = {
  verifyToken,
};
