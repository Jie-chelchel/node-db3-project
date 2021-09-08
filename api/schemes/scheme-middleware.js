const { type } = require("os");
const db = require("../../data/db-config");

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  try {
    const isExisting = await db("schemes")
      .where("scheme_id", req.params.scheme_id)
      .first();
    if (!isExisting) {
      res.status(404).json({
        message: `scheme with scheme_id ${req.params.scheme_id} not found`,
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  if (
    req.body.scheme_name === undefined ||
    !req.body.scheme_name.trim() ||
    typeof req.body.scheme_name !== "string"
  ) {
    res.status(400).json({
      message: "invalid scheme_name",
    });
  } else {
    next();
  }
};

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  if (
    req.body.instructions === undefined ||
    !req.body.instructions.trim() ||
    typeof req.body.instructions !== "string" ||
    typeof res.body.step_number !== "number" ||
    req.body.step_number < 1
  ) {
    res.status(400).json({
      message: "invalid steps",
    });
  } else {
    next();
  }
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};
