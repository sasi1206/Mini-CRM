const router = require("express").Router();
const { loginValidators } = require("../Validations/authValidations");
const { login, logout } = require("../Controllers/authController");
const validator = require("../Middlewares/validator");
const verifyToken = require("../Middlewares/verifyToken");

router.post("/login", loginValidators, validator, login);
router.post("/logout", verifyToken, logout);

module.exports = router;
