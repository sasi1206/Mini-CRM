const { body } = require("express-validator");

const task_title = body("task_title")
  .exists()
  .withMessage("Task title is required")
  .bail()
  .isString()
  .withMessage("Task title should be a string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Task title can't be empty")
  .bail()
  .isLength({ min: 10, max: 50 })
  .withMessage("Minimum 10 characters to Maximum 50 Characters")
  .escape();
const lead_id = body("lead_id")
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

const due_date = body("due_date")
  .exists()
  .withMessage("Due date is required")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Due date can't be empty")
  .bail()
  .isAfter({ comparisonDate: new Date().toISOString() })
  .withMessage("Due date should be in future");

const status = body("status")
  .exists()
  .withMessage("Status is required")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Status can't be empty")
  .bail()
  .isIn(["pending", "done"])
  .withMessage("Invalid status option")
  .escape();

const task_id = body("task_id")
  .exists()
  .withMessage("Task id is required")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Task id can't be empty")
  .bail()
  .isMongoId()
  .withMessage("Invalid mongodb id")
  .escape();

const createTaskValidations = [task_title, lead_id, due_date, status];
const updateTaskStatusValidations = [task_id];

module.exports = { createTaskValidations, updateTaskStatusValidations };
