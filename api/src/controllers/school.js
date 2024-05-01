/*
 * Controllers for school functionality
 * Author:
 * Modified:
 */
const router = require("express").Router();
const schoolService = require("../services/school.js");
const { useService } = require("../utils/extensions.js");
const passport = require("passport");
const { accessLevelCheck, badRequestCheck } = require("../utils/extensions.js");
const { check } = require("express-validator");
const constants = require("../utils/constants.js");
const statusResponses = require("../utils/status-response.js");

/**
 * Calls the API and creates a school
 */
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }), //authenticate with JWT
  accessLevelCheck(constants.ADMIN), //check if user is admin
  [
    check("name").not().isEmpty().withMessage("School name is required"),
    check("addressLine1")
      .not()
      .isEmpty()
      .isString()
      .withMessage("Address line 1 is required"),
    check("addressLine2")
      .optional()
      .isString()
      .withMessage("Address line 2 must be a string"),
    check("city").not().isEmpty().isString().withMessage("City is required"),
    check("state").not().isEmpty().isString().withMessage("State is required"),
    check("postalcode")
      .not()
      .isEmpty()
      .isInt()
      .withMessage("Postal code is required as a number"),
    check("usdcode")
      .not()
      .isEmpty()
      .isInt()
      .withMessage("USD code is required"),
  ],
  badRequestCheck, //check if there are any bad requests
  (req, res) => {
    useService(schoolService.registerSchool, req, res);
  }
);

/**
 * Calls the API and retrieves all schools
 */
router.get("/view", (req, res) => {
  useService(schoolService.getAllSchools, req, res);
});

/**
 * Calls the API and gets approved schools associated with an advisor
 */
router.get("/advisorApprovedSchools", (req, res) => {
  useService(schoolService.getAdvisorApprovedSchools, req, res);
});
module.exports = router;

/*
 * Calls the API and gets all schools associated with an advisor
 */
router.get("/advisorSchools", (req, res) => {
  const userId = req.query["userId"];
  schoolService
    .getAdvisorSchools(userId)
    .then((school) => {
      statusResponses.ok(res, school);
    })
    .catch((err) => {
      statusResponses.serverError(res);
    });
});
module.exports = router;
