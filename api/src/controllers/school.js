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

module.exports = router;
