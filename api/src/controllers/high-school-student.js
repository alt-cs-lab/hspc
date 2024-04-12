/*
MIT License
Copyright (c) 2024 KSU-CS-Software-Engineering
*/
const router = require("express").Router();
const { check } = require("express-validator");
const validator = require("validator");
const isEmpty = require("is-empty");
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
 * @api {post} /api/high-school-student/createStudent Register a new student
 * @apiName createStudent
 * @apiGroup HighSchoolStudent
 *
 * @apiBody {String} firstName First name of the student.
 * @apiBody {String} lastName Last name of the student.
 * @apiBody {String} email Valid email of the student.
 * @apiBody {Number} [schoolId] School ID of the student.
 * @apiBody {Number} [gradDate] Graduation Date is the date in which the student is graduating.
 *
 * @apiSuccess (Success 201) {JSON} message says {email} successfully registered
 * @apiError (Bad Request 400) {String} error Error message for invalid request body data.
 * @apiError (Internal Server Error 500) {String} error Error message for internal server errors.
 *
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1 400 Bad Request
 *   {
 *       First name is required.
 *   }
 */
router.post('/createStudent',
    // TWP TODO: Ensure school id is one of their approved schools
    passport.authenticate("jwt", { session: false }),
    accessLevelCheck(constants.ADVISOR),
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
    check('email')
        .not().isEmpty().withMessage("Email is required.")
        .normalizeEmail()
        .custom(async value => {
            try{
                return await studentService.getEmail(value) === null
                    ? Promise.resolve()
                    : Promise.reject()
            }
            catch {
                return Promise.reject()
            }
        }).withMessage("That email is already in use."),
    check('schoolId')
        .not().isEmpty().withMessage("School is required."),
    check('gradDate')
        .not().isEmpty().withMessage("Graduation Date is empty.")
], badRequestCheck, (req, res) => {
    useService(studentService.createStudent, req, res, 'created');
});

router.get('/getAllStudents',
    passport.authenticate("jwt", { session: false }),
    accessLevelCheck(constants.ADMIN),
    (req, res) => {
    studentService.getAllStudents()
    .then((studentData) => {
        statusResponses.ok(res, studentData);
    })
    .catch((err) => {
        statusResponses.serverError(res);
    });
    // useService(studentService.getAllStudents, req, res, 'got');
});

router.get('/getStudentsWithNoTeam',
    passport.authenticate("jwt", { session: false }),
    accessLevelCheck(constants.ADVISOR | constants.ADMIN),
    (req, res) => {
    // TWP TODO: Do School Checking for advisors
    var schoolId = req.query['schoolId'];
    studentService.getStudentsWithNoTeam(schoolId)
    .then((studentData) => {
        statusResponses.ok(res, studentData);
    })
    .catch((err) => {
        statusResponses.serverError(res);
    });
});

router.get('/getFromAdvisorSchools', 
    passport.authenticate("jwt", { session: false }),
    accessLevelCheck(constants.ADVISOR | constants.ADMIN),
    (req, res) => {
    // TWP TODO: Do School Checking for advisors
    var advisorId = req.query['advisorId'];
    studentService.getAdvisorSchoolsTeams(advisorId)
    .then((studentData) => {
        statusResponses.ok(res, studentData);
    })
    .catch((err) => {
        statusResponses.serverError(res);
    });
});


router.get("/teamStudents", 
    passport.authenticate("jwt", { session: false }),
    accessLevelCheck(constants.ADVISOR | constants.ADMIN),
    (req, res) => {
    // TWP TODO: Do School Checking for advisors
    let teamName = req.query["teamName"];
    let competitionid = req.query["competitionid"];
    studentService.getStudentsInTeam(competitionid, teamName)
      .then((studentData) => {
        statusResponses.ok(res, studentData);
      })
      .catch((err) => {
        statusResponses.serverError(res);
      });
  });

module.exports = router;