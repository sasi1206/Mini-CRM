const router = require("express").Router();
const {
  getLeads,
  createLead,
  editLead,
  deleteLead,
} = require("../Controllers/leadController");
const {
  createLeadValidations,
  editLeadValidations,
  deleteLeadValidations,
} = require("../Validations/leadValidations");
const validator = require("../Middlewares/validator");
const verifyToken = require("../Middlewares/verifyToken");

router
  .route("/")
  .get(verifyToken, getLeads)
  .post(verifyToken, createLeadValidations, validator, createLead)
  .patch(verifyToken, editLeadValidations, validator, editLead)
  .delete(verifyToken, deleteLeadValidations, validator, deleteLead);

module.exports = router;
