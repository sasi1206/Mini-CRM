const { body, query } = require("express-validator");

const name = body("name")
  .exists()
  .withMessage("Lead name is required")
  .bail()
  .isString()
  .withMessage("Lead name should be a string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Lead name can't be empty")
  .bail()
  .isLength({ min: 10, max: 50 })
  .withMessage("Minimum 10 characters to Maximum 50 Characters")
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

const phone = body("phone")
  .exists()
  .withMessage("Phone is required")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Phone can't be empty")
  .bail()
  .isMobilePhone("en-IN")
  .withMessage("Invalid phone number")
  .escape();

const status = body("status")
  .exists()
  .withMessage("Status is required")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Status can't be empty")
  .bail()
  .isIn(["new", "contacted", "lost"])
  .withMessage("Invalid status option")
  .escape();

const assigned_to = body("assigned_to")
  .exists()
  .withMessage("Assigned to is required")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Assigned to can't be empty")
  .escape();

const company_id = body("company_id")
  .exists()
  .withMessage("Company id is required")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Company id can't be empty")
  .bail()
  .isMongoId()
  .withMessage("Invalid mongodb id")
  .escape();

const _id = body("_id")
  .exists()
  .withMessage("Lead id is required")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Lead id can't be empty")
  .bail()
  .isMongoId()
  .withMessage("Invalid mongodb id")
  .escape();

const deleteId = query("id")
  .exists()
  .withMessage("Lead id is required")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Lead id can't be empty")
  .bail()
  .isMongoId()
  .withMessage("Invalid mongodb id")
  .escape();

const createLeadValidations = [
  name,
  email,
  phone,
  status,
  assigned_to,
  company_id,
];

const editLeadValidations = [
  _id,
  name,
  email,
  phone,
  status,
  assigned_to,
  company_id,
];

const deleteLeadValidations = [deleteId];

module.exports = {
  createLeadValidations,
  editLeadValidations,
  deleteLeadValidations,
};
