/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
const router = require("express").Router();
const eventService = require("../services/event.js");
const passport = require("passport");
const { accessLevelCheck, badRequestCheck, useService } = require("../utils/extensions.js");
const { check } = require("express-validator");
const constants = require("../utils/constants.js");

/*
* Calls the API and returns all published events
* Author: Casey Ring
*/
router.get("/getPublished", (req, res) => {
    useService(eventService.getPublished, req, res);
});

/*
* Calls the API and returns all unpublished events
* Author: Casey Ring
*/
router.get("/getUnpublished", (req, res) => {
    useService(eventService.getUnpublished, req, res);
});

router.get("/get", (req, res) => {
    useService(eventService.getEvent, req, res);
});

/*
* Calls the API and returns the most upcoming event or if there are none, the most recent.
* Author: Trent Powell
*/
router.get("/highlightEvent", (req, res) => {
    useService(eventService.getHighlightEvent, req, res);
});

/**
 * @api {post} /api/event/create Create Event
 * @apiName CreateEvent
 * @apiGroup Event
 * @apiHeader {String} Authorization JWT Token
 * @apiDescription Creates a new event using the values in the body.
 *
 * @apiBody {String} name The name of the event.
 * @apiBody {String} [location] The location of the event.
 * @apiBody {String} [date] The date of the event.
 * @apiBody {String} [time] The time of the event.
 * @apiBody {Number} [beginnerTeamsPerSchool] The number of teams per school.
 * @apiBody {Number} [advancedTeamsPerSchool] The number of teams per school.
 * @apiBody {Number} [teamsPerSchool] The number of teams per school.
 * @apiBody {Number} [beginnerTeamsPerEvent] The number of beginner teams per event.
 * @apiBody {Number} [advancedTeamsPerEvent] The number of advanced teams per event.
 * @apiBody {Number} [teamsPerEvent] The number of teams per event.
 * @apiBody {String} [description] The description of the event.
 *
 * @apiSuccess (Success 201) {Number} success HTTP status code indicating success.
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
router.post("/create", [
        check("name")
            .not().isEmpty().withMessage("Name is required"),
        check("location")
            .not().isEmpty().withMessage("Location is required"),
        check("date")
            .isDate().withMessage("Date is required"),
        check("startTime")
            .isTime().withMessage("Start Time is required"),
        check("endTime")
            .isTime().withMessage("End Time is required"),
        check("beginnerTeamsPerSchool")
            .isInt({ min: 0 }).withMessage("Beginner Teams per school"),
        check("advancedTeamsPerSchool")
            .isInt({ min: 0 }).withMessage("Advanced Teams per school required"),
        check("teamsPerSchool")
            .isInt({ min: 1 }).withMessage("Teams per school required"),
        check("beginnerTeamsPerEvent")
            .isInt({ min: 0 }).withMessage("Beginner Teams per school required"),
        check("advancedTeamsPerEvent")
            .isInt({ min: 0 }).withMessage("Advanced Teams per school required"),
        check("teamsPerEvent")
            .isInt({ min: 2 }).withMessage("Teams per event required"),
        check("description")
            .not().isEmpty().withMessage("Description is required"),

    ],
    passport.authenticate("jwt", { session: false }), //authenticate with JWT
    accessLevelCheck(constants.ADMIN), //check if user is admin
    badRequestCheck, //check if there are any bad requests
    (req, res) => {
        useService(eventService.createEvent, req, res, 'created');
    }
);

/*
* Updates an existing event using the values in the body.
* Author: Casey Ring
*/

router.post("/update", [
    check("name")
        .not().isEmpty().withMessage("Name is required"),
    check("location")
        .not().isEmpty().withMessage("Location is required"),
    check("date")
        .isDate().withMessage("Date is required"),
    check("startTime")
        .isTime().withMessage("Start Time is required"),
    check("endTime")
        .isTime().withMessage("End Time is required"),
    check("beginnerTeamsPerSchool")
        .isInt({ min: 0 }).withMessage("Beginner Teams per school"),
    check("advancedTeamsPerSchool")
        .isInt({ min: 0 }).withMessage("Advanced Teams per school required"),
    check("teamsPerSchool")
        .isInt({ min: 1 }).withMessage("Teams per school required"),
    check("beginnerTeamsPerEvent")
        .isInt({ min: 0 }).withMessage("Beginner Teams per school required"),
    check("advancedTeamsPerEvent")
        .isInt({ min: 0 }).withMessage("Advanced Teams per school required"),
    check("teamsPerEvent")
        .isInt({ min: 2 }).withMessage("Teams per event required"),
    check("description")
        .not().isEmpty().withMessage("Description is required"),

],
passport.authenticate("jwt", { session: false }), //authenticate with JWT
accessLevelCheck(constants.ADMIN), //check if user is admin
badRequestCheck, //check if there are any bad requests
(req, res) => {
    useService(eventService.updateEvent, req, res, 'created');
}
);

module.exports = router;
