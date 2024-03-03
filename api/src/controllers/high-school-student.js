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
  minimumAccessLevelCheck,
} = require("../utils/extensions.js");
const constants = require("../utils/constants.js");
//const userService = require("../services/user");
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
//passport.authenticate("jwt", { session: false }),
//minimumAccessLevelCheck(constants.ADVISOR),
//[
//  check("userId").exists().withMessage("User ID is required."),
//  // check is number
//  check("userId").isNumeric().withMessage("User ID must be a number."),
//],
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
        //TWP TODO: Ensure Email is not in database
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

router.get('/getStudents', (req, res) => {
    useService(studentService.getStudents, req, res, 'got');
});

router.get('/getFromAdvisorSchools', (req, res) => {
    // TWP TODO: Do Role Checking
    var advisorId = req.query['advisorId'];
    studentService.getAdvisorSchoolsTeams(advisorId)
    .then((studentData) => {
        statusResponses.ok(res, studentData);
    })
    .catch((err) => {
        statusResponses.serverError(res);
    });
});

module.exports = router;