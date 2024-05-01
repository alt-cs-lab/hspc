/**
 * Controllers for user functionality
 * Author:
 * Modified:
 */
const router = require("express").Router();
const { check } = require("express-validator");
const validator = require("validator");
const isEmpty = require("is-empty");
const passport = require("passport");

const statusResponses = require("../utils/status-response.js");
const {
  badRequestCheck,
  useService,
  accessLevelCheck,
} = require("../utils/extensions.js");
const constants = require("../utils/constants.js");
const userService = require("../services/user");
const schoolService = require("../services/school.js");

/*
 * API Endpoint that returns all users stored within the database.
 */
router.get("/view", passport.authenticate("jwt", { session: false }), accessLevelCheck(constants.ADMIN), (req, res) => {
  userService.getAllUsers()
    .then((userdata) => {
      statusResponses.ok(res, userdata);
    })
    .catch((err) => {
      statusResponses.serverError(res);
    });
});

/**
 * Register a new user
 */
router.post(
  "/register",
  [
    check("firstName")
      .isLength({ max: 100 })
      .withMessage("First name must be less than 100 characters.")
      .not()
      .isEmpty()
      .withMessage("First name is required.")
      .trim()
      .escape(),
    check("lastName")
      .isLength({ max: 100 })
      .withMessage("Last name must be less than 100 characters.")
      .not()
      .isEmpty()
      .withMessage("Last name is required.")
      .trim()
      .escape(),
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required.")
      // TODO TWP: Add Back if CAS registration comes back
      //.isEmail({ host_blacklist: ['ksu.edu']}).withMessage("Invalid email format.")
      .normalizeEmail()
      .custom(async (value) => {
        try {
          return (await userService.getLogin())
            ? Promise.reject()
            : Promise.resolve();
        } catch {
          return Promise.reject();
        }
      })
      .withMessage("That email is already in use."),
    check("phone")
      .isLength({ max: 11 })
      .trim()
      .escape()
      .custom((value) => {
        if (isEmpty(value)) {
          return true;
        }
        return validator.isInt(value);
      })
      .withMessage(
        "Please enter your phone number without dashes or slashes, ex: 5553331111 or 15553331111"
      ),
    check("password")
      .isLength({ min: 8, max: 32 })
      .withMessage(
        "Passwords must be at least 8 characters and no more than 32."
      )
      .not()
      .isEmpty()
      .withMessage("Password is required"),
    check("requestLevel")
      .not()
      .isEmpty()
      .withMessage("Invalid request level.")
      .isIn([constants.VOLUNTEER, constants.ADVISOR])
      .withMessage("Invalid request level."),
    check("schoolId")
      .custom((schoolId, { req }) => {
        if (req.body["requestLevel"] == constants.ADVISOR) {
          return !isEmpty(schoolId);
        }
        return true;
      })
      .withMessage("School Id is required for advisors.")
      .custom((schoolId, { req }) => {
        if (req.body["requestLevel"] == constants.ADVISOR) {
          // return false if we could not find a school with that ID
          return schoolService.getAllSchools().then((schools) => {
            return schools.some((school) => {
              return school.id == schoolId;
            });
          });
        }
        return true;
      })
      .withMessage("A school with that ID does not exist."),
  ],
  badRequestCheck,
  (req, res) => {
    useService(userService.register, req, res, "created");
  }
);

/**
 * Updates a user's profile based on their id
 */
router.post("/updateProfile", (req, res) => {
  useService(userService.updateProfile, req, res);
});

module.exports = router;
