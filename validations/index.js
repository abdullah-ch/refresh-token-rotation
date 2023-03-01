const { body, validationResult } = require("express-validator");
const userSignUpRules = () => {
  return [
    body("email").isEmail().withMessage("Invalid Email Format"),
    body("password")
      .not()
      .isEmpty()
      .bail()
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 chars long"),
    body("name").isString().not().isEmpty().withMessage("Name cannot be empty"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  userSignUpRules,
  validate,
};
