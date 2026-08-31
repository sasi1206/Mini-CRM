const router = require("express").Router();
const { getUsers, createUser } = require("../Controllers/userController");
const { createUserValidators } = require("../Validations/authValidations");
const verifyToken = require("../Middlewares/verifyToken");
const validator = require("../Middlewares/validator");

router
  .route("/")
  .get(verifyToken, getUsers)
  .post(verifyToken, createUserValidators, validator, createUser);

module.exports = router;
