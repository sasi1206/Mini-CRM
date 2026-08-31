const router = require("express").Router();
const {
  createTaskValidations,
  updateTaskStatusValidations,
} = require("../Validations/taskValidations");
const {
  fetchTasks,
  createTask,
  updateStatus,
} = require("../Controllers/taskController");
const validator = require("../Middlewares/validator");
const verifyToken = require("../Middlewares/verifyToken");

router
  .route("/")
  .get(verifyToken, fetchTasks)
  .post(verifyToken, createTaskValidations, validator, createTask)
  .put(verifyToken, updateStatus, updateTaskStatusValidations, updateStatus);

module.exports = router;
