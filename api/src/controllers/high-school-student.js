/*
 * Controllers for high school student functionality
 * Author: 
 * Modified: 
 */
const router = require("express").Router();
const { check } = require("express-validator");
const passport = require("passport");
const {
  badRequestCheck,
  useService,
  accessLevelCheck,
} = require("../utils/extensions.js");
const constants = require("../utils/constants.js");
const studentService = require("../services/high-school-student");
const statusResponses = require("../utils/status-response.js");

/**
 * Register a new student
 */
router.post(
  "/createStudent",
  // TWP TODO: Ensure school id is one of their approved schools
  passport.authenticate("jwt", { session: false }),
  accessLevelCheck(constants.ADVISOR),
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
      .normalizeEmail()
      .custom(async (value) => {
        try {
          return (await studentService.getEmail(value)) === null
            ? Promise.resolve()
            : Promise.reject();
        } catch {
          return Promise.reject();
        }
      })
      .withMessage("That email is already in use."),
    check("schoolId").not().isEmpty().withMessage("School is required."),
    check("gradDate").not().isEmpty().withMessage("Graduation Date is empty."),
  ],
  badRequestCheck,
  (req, res) => {
    useService(studentService.createStudent, req, res, "created");
  }
);

router.post('/editStudent',
    passport.authenticate("jwt", { session: false }),
    accessLevelCheck(constants.ADVISOR | constants.ADMIN),
    [
    check('firstName')
        .isLength({max: 100}).withMessage('First name must be less than 100 characters.')
        .not().isEmpty().withMessage("First name is required.")
        .trim()
        .escape(),
    check('lastName')
        .isLength({max: 100}).withMessage('Last name must be less than 100 characters.')
        .not().isEmpty().withMessage("Last name is required.")
        .trim()
        .escape(),
    check('schoolId')
        .not().isEmpty().withMessage("School is required."),
    check('gradDate')
        .not().isEmpty().withMessage("Graduation Date is empty.")
], badRequestCheck, (req, res) => {
    useService(studentService.editStudent, req, res, 'edited');
});

/*
 * Returns all students
 */
router.get(
  "/getAllStudents",
  passport.authenticate("jwt", { session: false }),
  accessLevelCheck(constants.ADMIN),
  (req, res) => {
    studentService
      .getAllStudents()
      .then((studentData) => {
        statusResponses.ok(res, studentData);
      })
      .catch((err) => {
        statusResponses.serverError(res);
      });
    // useService(studentService.getAllStudents, req, res, 'got');
  }
);

/*
 * Returns all students not assigned to a team
 */
router.get(
  "/getStudentsWithNoTeam",
  passport.authenticate("jwt", { session: false }),
  accessLevelCheck(constants.ADVISOR | constants.ADMIN),
  (req, res) => {
    // TWP TODO: Do School Checking for advisors
    var schoolId = req.query["schoolId"];
    studentService
      .getStudentsWithNoTeam(schoolId)
      .then((studentData) => {
        statusResponses.ok(res, studentData);
      })
      .catch((err) => {
        statusResponses.serverError(res);
      });
  }
);

/*
 * Returns all teams from each school associated with an advisor.
 */
router.get(
  "/getFromAdvisorSchools",
  passport.authenticate("jwt", { session: false }),
  accessLevelCheck(constants.ADVISOR | constants.ADMIN),
  (req, res) => {
    // TWP TODO: Do School Checking for advisors
    var advisorId = req.query["advisorId"];
    studentService
      .getAdvisorSchoolsTeams(advisorId)
      .then((studentData) => {
        statusResponses.ok(res, studentData);
      })
      .catch((err) => {
        statusResponses.serverError(res);
      });
  }
);

/*
 * Returns all students in a team
 */
router.get(
  "/teamStudents",
  passport.authenticate("jwt", { session: false }),
  accessLevelCheck(constants.ADVISOR | constants.ADMIN),
  (req, res) => {
    // TWP TODO: Do School Checking for advisors
    let teamid = req.query["teamid"];
    studentService
      .getStudentsInTeam(teamid)
      .then((studentData) => {
        statusResponses.ok(res, studentData);
      })
      .catch((err) => {
        statusResponses.serverError(res);
      });
  }
);

module.exports = router;
