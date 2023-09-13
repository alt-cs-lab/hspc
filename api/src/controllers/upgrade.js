/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
const router = require("express").Router();
const upgradeService = require("../services/upgrade");
const passport = require("passport");
const { minimumAccessLevelCheck, badRequestCheck, useService } = require("../utils/extensions");
const constants = require("../utils/constants");
const { check } = require("express-validator");

/**
 * @api {get} /api/upgrade/view View Upgrade Requests
 * @apiName ViewUpgradeRequests
 * @apiGroup Upgrade
 * @apiHeader {String} Authorization JWT Token
 * @apiDescription Returns a list of JSON objects of every User who has an outstanding upgrade request.
 *
 * @apiSuccess {Array} data List of User Objects
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *         {
 *             "firstname": "Carl",
 *             "lastname": "Schwarts",
 *             "email": "cschwarts@gmail.com",
 *             "phone": null,
 *             "accesslevel": 1,
 *             "requestlevel": 20
 *         },
 *         ...
 *     ]
 *
 * @apiError {Number} 401 Unauthorized
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       Unauthorized
 *     }
 */
router.get(
    "/view",
    passport.authenticate("jwt", { session: false }),
    minimumAccessLevelCheck(constants.ADMIN),
    (req, res) => {
        useService(upgradeService.getAllUpgrades, req, res);
    }
);

/**
 * @api {post} /api/upgrade/accept Accept Upgrade Request
 * @apiName AcceptUpgradeRequest
 * @apiGroup Upgrade
 * @apiHeader {String} Authorization JWT Token
 * @apiDescription Accepts an outstanding upgrade request for a user specified by an email.
 *
 * @apiBody {String} email The email of the User to upgrade
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
router.post(
    "/accept",
    passport.authenticate("jwt", { session: false }),
    minimumAccessLevelCheck(constants.ADMIN),
    [
        check("email").not().isEmpty().withMessage("`email` must be present in the request body."),
    ],
    badRequestCheck,
    (req, res) => {
        useService(upgradeService.acceptUpgradeRequest, req, res);
    }
);

/**
 * @api {post} /api/upgrade/reject Reject Upgrade Request
 * @apiName RejectUpgradeRequest
 * @apiGroup Upgrade
 * @apiHeader {String} Authorization JWT Token
 * @apiDescription Rejects an outstanding upgrade request for the User associated with the specified email.
 *
 * @apiBody {String} email The email of the User to reject the upgrade request for
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
router.post(
    "/reject",
    passport.authenticate("jwt", { session: false }), // authenticate with JWT
    minimumAccessLevelCheck(constants.ADMIN), // check if user is admin
    [check("email").not().isEmpty().withMessage("`email` must be present in the request body.")], // check if email is present
    badRequestCheck, // check if there are any bad requests
    (req, res) => {
        useService(upgradeService.rejectUpgradeRequest, req, res);
    }
);

module.exports = router;
