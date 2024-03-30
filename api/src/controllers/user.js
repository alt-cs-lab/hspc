/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
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
 *
 * @author: Daniel Bell
 * @param {string} endpoint location
 * @param {JSON} callback function containing request and response data from the client.
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

/*
 * API Endpoint that returns all users where with volunteer access level stored within the database.
 *
 * @author: Trey Moddelmog
 * @param {string} endpoint location
 * @param {JSON} callback function containing request and response data from the client.
 */
router.get("/volunteers", (req, res) => {
  userService
    .getAllVolunteers()
    .then((userdata) => {
      statusResponses.ok(res, userdata);
    })
    .catch((err) => {
      statusResponses.serverError(res);
    });
});

/*
 *API Endpoint that returns all volunteers set as currently checked in
 */
router.get("/activevolunteers", (req, res) => {
  userService
    .getactivevolunteers()
    .then((userdata) => {
      statusResponses.ok(res, userdata);
    })
    .catch((err) => {
      statusResponses.serverError(res);
    });
});

/*
 * API Endpoint that sets a volunteer as checked in
 */
router.post("/checkinvolunteer", (req, res) => {
  console.log("in router.post/checkinvolunteer.");
  const uId = req.body["userId"];

  userService
    .checkinvolunteer(uId)
    .then(() => {
      statusResponses.ok(res, "volunteer checked in");
    })
    .catch((err) => {
      statusResponses.serverError(err);
    });
});

/*
 *API Endpoint that sets a volunteer as checked out
 */
router.post("/checkoutvolunteer", (req, res) => {
  console.log("in router.post/checkoutvolunteer.");
  const uId = req.body["userId"];

  userService
    .checkoutvolunteer(uId)
    .then(() => {
      statusResponses.ok(res, "volunteer checked out");
    })
    .catch((err) => {
      statusResponses.serverError(err);
    });
});

/**
 * @api {post} /api/user/register Register a new user
 * @apiName RegisterUser
 * @apiGroup User
 *
 * @apiBody {String} firstName First name of the user.
 * @apiBody {String} lastName Last name of the user.
 * @apiBody {String} email Valid email of the user.
 * @apiBody {String} password Password of the user.
 * @apiBody {String} [phone] Phone number of the user.
 * @apiBody {Number} requestLevel Request level of the user.
 * @apiBody {String} [advisorEmail] Advisor email of the user, required if requesting as a Student.
 * @apiBody {Number} [schoolId] School ID of the user, required if requesting as an Advisor.
 *
 * @apiSuccess (Success 201) {JSON} message says {email} successfully registered
 * @apiError (Bad Request 400) {String} error Error message for invalid request body data.
 * @apiError (Internal Server Error 500) {String} error Error message for internal server errors.
 *
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1 400 Bad Request
 *   {
 *       Advisor email is required for students.
 *   }
 */
router.post('/register', [
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
        .not()
        .isEmpty().withMessage("Email is required.")
        // TODO TWP: Add Back if CAS registration comes back
        //.isEmail({ host_blacklist: ['ksu.edu']}).withMessage("Invalid email format.")
        .normalizeEmail()
        .custom(async value => {
            try{
                return await userService.getLogin()
                    ? Promise.reject()
                    : Promise.resolve()
            }
            catch {
                return Promise.reject()
            }
        }).withMessage("That email is already in use."),
    check('phone')
        .isLength({max: 11})
        .trim()
        .escape()
        .custom(value => {
            if (isEmpty(value)) {
                return true;
            }
            return validator.isInt(value);
        }).withMessage("Please enter your phone number without dashes or slashes, ex: 5553331111 or 15553331111"),
    check('password')
        .isLength({min: 8, max: 32}).withMessage('Passwords must be at least 8 characters and no more than 32.')
        .not().isEmpty().withMessage("Password is required"),
    check('requestLevel')
        .not().isEmpty().withMessage('Invalid request level.')
        .isIn([
            constants.VOLUNTEER,
            constants.ADVISOR]).withMessage('Invalid request level.'),
    check('schoolId')
        .custom((schoolId, {req}) => {
            if (req.body['requestLevel'] == constants.ADVISOR) {
                return !isEmpty(schoolId);
            }
            return true;
        }).withMessage('School Id is required for advisors.')
        .custom((schoolId, {req}) => {
            if (req.body['requestLevel'] == constants.ADVISOR) {
                // return false if we could not find a school with that ID
                return schoolService.getAllSchools().then(schools => {
                    return schools.some(school => {
                        return school.id == schoolId;
                    });
                });                
            }
            return true;
        }).withMessage('A school with that ID does not exist.')
], badRequestCheck, (req, res) => {
    useService(userService.register, req, res, 'created');
});

router.post("/updateProfile", (req, res) => {
  useService(userService.updateProfile, req, res);
});

module.exports = router;
