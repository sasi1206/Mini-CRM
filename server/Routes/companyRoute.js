const router = require("express").Router();
const {
  fetchCompanies,
  createCompany,
} = require("../Controllers/companyController");
const createCompanyValidations = require("../Validations/companyValidations");
const validator = require("../Middlewares/validator");
const verifyToken = require("../Middlewares/verifyToken");

router
  .route("/")
  .get(verifyToken, fetchCompanies)
  .post(verifyToken, createCompanyValidations, validator, createCompany);

module.exports = router;
