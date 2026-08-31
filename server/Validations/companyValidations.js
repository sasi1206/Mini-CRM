const { body } = require("express-validator");

const company_name = body("company_name")
  .exists()
  .withMessage("Company name is required")
  .bail()
  .isString()
  .withMessage("Company name should be a string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Company name can't be empty")
  .bail()
  .isLength({ min: 10, max: 50 })
  .withMessage("Minimum 10 characters to Maximum 50 Characters")
  .escape();

const industry = body("industry")
  .exists()
  .withMessage("Industry is required")
  .bail()
  .isString()
  .withMessage("Industry should be a string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Industry can't be empty")
  .bail()
  .isLength({ min: 2, max: 60 })
  .withMessage("Minimum 2 characters to Maximum 60 Characters")
  .escape();

const location = body("location")
  .exists()
  .withMessage("Location is required")
  .bail()
  .isString()
  .withMessage("Location should be a string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Location can't be empty")
  .bail()
  .isLength({ min: 8, max: 50 })
  .withMessage("Minimum 8 characters to Maximum 50 Characters")
  .escape();

module.exports = [company_name, industry, location];
