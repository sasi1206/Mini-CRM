const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const error = validationResult(req);

  const errorArray = error.array();

  if (!error.isEmpty()) {
    let errorObj = {};
    console.log(errorArray);
    errorArray.forEach((eachError) => {
      errorObj[eachError.path] = eachError.msg;
    });

    return res.status(422).json({
      success: false,
      validationErrors: errorObj,
    });
  } else {
    next();
  }
};

module.exports = validate;
