/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
const router = require("express").Router();
const schoolService = require("../services/school.js");
const { useService } = require("../utils/extensions.js");
const passport = require("passport");
const { minimumAccessLevelCheck, badRequestCheck } = require("../utils/extensions.js");
const {check} = require("express-validator");
const constants = require("../utils/constants.js");
const statusResponses = require("../utils/status-response.js");

/**
 * @api {post} /api/school/create Create School
 * @apiName CreateSchool
 * @apiGroup School
 * @apiDescription Creates a school.
 * 
 * @apiBody {String} name Name of the school.
 * @apiBody {String} [addressLine1] Address line 1 of the school.
 * @apiBody {String} [addressLine2] Address line 2 of the school.
 * @apiBody {String} [city] City of the school.
 * @apiBody {String} [state] State of the school.
 * @apiBody {Integer} [postalCode] Postal code of the school.
 * @apiBody {String} [usdCode] USD code of the school.
 * 
 * @apiSuccess (Success 200) {Number} success HTTP status code indicating success
 *
 * @apiError {Number} 401 Unauthorized
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       Unauthorized
 *     }
 *
 * @apiError {Number} 500 Internal Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Internal Server Error"
 *     }
 */
router.post("/create",
    passport.authenticate("jwt", { session: false }), //authenticate with JWT
    minimumAccessLevelCheck(constants.ADMIN), //check if user is admin
    [
        check('name').not().isEmpty().withMessage('School name is required'),
        // everything else does not have to be there but should be of the correct type
        check('addressLine1').optional().isString().withMessage('Address line 1 must be a string'),
        check('addressLine2').optional().isString().withMessage('Address line 2 must be a string'),
        check('city').optional().isString().withMessage('City must be a string'),
        check('state').optional().isString().withMessage('State must be a string'),
        check('postalCode').optional().isInt().withMessage('Postal code must be an integer'),
        check('usdCode').optional().isString().withMessage('USD code must be a string')
    ], 
    badRequestCheck, //check if there are any bad requests
    (req, res) => {
        useService(schoolService.registerSchool, req, res);
});

/**
 * @api {get} /api/school/view View Schools
 * @apiName ViewSchools
 * @apiGroup School
 * @apiDescription Retrieves all schools.
 *
 * @apiSuccess (Success 200) {List} schools List of schools.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   [
 *      {
 *          "id": 1,
 *          "name": "500 Reach",
 *          "addressLine1": "7704 Parallel Pkwy",
 *          "addressLine2": null,
 *          "city": "Kansas City ",
 *          "State": "KS",
 *          "postalcode": 66112,
 *          "usdcode": "500"
 *      },
 *      {
 *          "id": 2,
 *          "name": "Abilene High School",
 *          "addressLine1": "1300 N Cedar St",
 *          "addressLine2": null,
 *          "city": "Abilene ",
 *          "State": "KS",
 *          "postalcode": 67410,
 *          "usdcode": "435"
 *      },
 *      ...
 *  ]
 */
router.get("/view", (req, res) => {
    useService(schoolService.getAllSchools, req, res);
});


/**
 * @api {post} /api/user/advisorschool Get school associated with an advisor
 * @apiName AdvisorSchool
 * @apiGroup User
 *
 * @apiBody {Number} userId User ID of the user.
 * @apiSuccess (Success 201) {JSON} school name and id of the school associated with the advisor.
 * @apiError (Bad Request 400) {String} error Error message for invalid request body data.
 * @apiError (Internal Server Error 500) {String} error Error message for internal server errors.
 *
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1 400 Bad Request
 *   {
 *       Advisor email is required for students.
 *   }
 */
router.get(
    "/advisorSchools",
    // passport.authenticate("jwt", { session: false }),
    // minimumAccessLevelCheck(constants.ADVISOR),
    // [
    //   check("userId").exists().withMessage("User ID is required."),
    //   // check is number
    //   check("userId").isNumeric().withMessage("User ID must be a number."),
    // ],
    // badRequestCheck,
    (req, res) => {
      const userId = req.query["userId"];
      schoolService.getAdvisorSchools(userId)
        .then((school) => {
          statusResponses.ok(res, school);
        })
        .catch((err) => {
          statusResponses.serverError(res);
        });
    }
  );
module.exports = router;
