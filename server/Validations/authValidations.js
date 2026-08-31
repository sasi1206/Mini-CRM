const { body } = require("express-validator");

const username = body("username")
  .exists()
  .withMessage("Username is required")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Username can't be empty")
  .bail()
  .isLength({ min: 5, max: 40 })
  .withMessage("Username must be minimum 5 to maximum 40 characters")
  .escape();

const email = body("email")
  .exists()
  .withMessage("Email is required")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Email can't be empty")
  .bail()
  .isEmail()
  .withMessage("Invalid email address")
  .bail()
  .isLength({ max: 40 })
  .withMessage("Email must be less than 40 characters")
  .escape();

const password = body("password")
  .exists()
  .withMessage("Password is required")
  .bail()
  .isString()
  .withMessage("Password must be string")
  .bail()
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters")
  .isLength({ max: 20 })
  .withMessage("Password must be less than 20 characters")
  .isStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .withMessage(
    "Password must have at least one lowercase, one uppercase, one number and one symbol",
  )
  .escape();

const createUserValidators = [username, email, password];

const loginValidators = [email, password];

module.exports = { createUserValidators, loginValidators };
