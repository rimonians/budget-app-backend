// Import external module
const { check, validationResult } = require("express-validator");

// Import user model
const User = require("../../models/userModel");

// Auth signup validation middleware
const authSignupValidation = [
  check("username", "Username required")
    .not()
    .isEmpty()
    .isAlpha("en-US", { ignore: "-_ " })
    .withMessage("Username only contain english letter , (-,_) & space")
    .isLength({ min: 5 })
    .withMessage("Username required at least 5 character")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ username: value });
        if (user) {
          return Promise.reject("Username already in use");
        }
      } catch (err) {
        return Promise.reject(err.message);
      }
    }),
  check("email", "Email required")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Email address is not valid")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("Email already in use");
        }
      } catch (err) {
        return Promise.reject(err.message);
      }
    }),
  check("password", "Password required")
    .not()
    .isEmpty()
    .isStrongPassword()
    .withMessage("Password is not strong"),
];

// Handle auth signup validation middleware
const handleAuthSignupValidation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.entries(mappedErrors).length === 0) {
      next();
    } else {
      res.status(400).json({ errors: mappedErrors });
    }
  } catch (err) {
    next(err);
  }
};

// Export auth signup validation & handle auth signup validation middlewares
module.exports = { authSignupValidation, handleAuthSignupValidation };
