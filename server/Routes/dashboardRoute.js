const router = require("express").Router();
const {
  getDropDownOptions,
  getData,
} = require("../Controllers/dashboardController");
const verifyToken = require("../Middlewares/verifyToken");

router.route("/").get(verifyToken, getData);
router.route("/options").get(verifyToken, getDropDownOptions);

module.exports = router;
