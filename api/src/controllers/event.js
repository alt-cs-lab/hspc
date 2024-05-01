/*
 * Controllers for event functionality
 * Author: 
 * Modified: 
 */
const router = require("express").Router();
const eventService = require("../services/event.js");
const passport = require("passport");
const {
  accessLevelCheck,
  badRequestCheck,
  useService,
} = require("../utils/extensions.js");
const { check } = require("express-validator");
const constants = require("../utils/constants.js");

/*
 * Calls the API and returns all published events
 */
router.get("/getPublished", (req, res) => {
  useService(eventService.getPublished, req, res);
});

/*
 * Calls the API and returns all unpublished events
 */
router.get("/getUnpublished", (req, res) => {
  useService(eventService.getUnpublished, req, res);
});

/*
 * Calls the API and returns all events
 */
router.get("/get", (req, res) => {
  useService(eventService.getEvent, req, res);
});

/*
 * Calls the API and returns the most upcoming event or if there are none, the most recent.
 */
router.get("/highlightEvent", (req, res) => {
  useService(eventService.getHighlightEvent, req, res);
});

/**
 * Creates a new event using the values in the body.
 */
router.post(
  "/create",
  [
    check("name").not().isEmpty().withMessage("Name is required"),
    check("location").not().isEmpty().withMessage("Location is required"),
    check("date").isDate().withMessage("Date is required"),
    check("startTime").isTime().withMessage("Start Time is required"),
    check("endTime").isTime().withMessage("End Time is required"),
    check("beginnerTeamsPerSchool")
      .isInt({ min: 0 })
      .withMessage("Beginner Teams per school"),
    check("advancedTeamsPerSchool")
      .isInt({ min: 0 })
      .withMessage("Advanced Teams per school required"),
    check("teamsPerSchool")
      .isInt({ min: 1 })
      .withMessage("Teams per school required"),
    check("beginnerTeamsPerEvent")
      .isInt({ min: 0 })
      .withMessage("Beginner Teams per school required"),
    check("advancedTeamsPerEvent")
      .isInt({ min: 0 })
      .withMessage("Advanced Teams per school required"),
    check("teamsPerEvent")
      .isInt({ min: 2 })
      .withMessage("Teams per event required"),
    check("description").not().isEmpty().withMessage("Description is required"),
  ],
  passport.authenticate("jwt", { session: false }), //authenticate with JWT
  accessLevelCheck(constants.ADMIN), //check if user is admin
  badRequestCheck, //check if there are any bad requests
  (req, res) => {
    useService(eventService.createEvent, req, res, "created");
  }
);

/*
 * Updates an existing event using the values in the body.
 */
router.post(
  "/update",
  [
    check("name").not().isEmpty().withMessage("Name is required"),
    check("location").not().isEmpty().withMessage("Location is required"),
    check("date").isDate().withMessage("Date is required"),
    check("startTime").isTime().withMessage("Start Time is required"),
    check("endTime").isTime().withMessage("End Time is required"),
    check("beginnerTeamsPerSchool")
      .isInt({ min: 0 })
      .withMessage("Beginner Teams per school"),
    check("advancedTeamsPerSchool")
      .isInt({ min: 0 })
      .withMessage("Advanced Teams per school required"),
    check("teamsPerSchool")
      .isInt({ min: 1 })
      .withMessage("Teams per school required"),
    check("beginnerTeamsPerEvent")
      .isInt({ min: 0 })
      .withMessage("Beginner Teams per school required"),
    check("advancedTeamsPerEvent")
      .isInt({ min: 0 })
      .withMessage("Advanced Teams per school required"),
    check("teamsPerEvent")
      .isInt({ min: 2 })
      .withMessage("Teams per event required"),
    check("description").not().isEmpty().withMessage("Description is required"),
  ],
  passport.authenticate("jwt", { session: false }), //authenticate with JWT
  accessLevelCheck(constants.ADMIN), //check if user is admin
  badRequestCheck, //check if there are any bad requests
  (req, res) => {
    useService(eventService.updateEvent, req, res, "created");
  }
);

module.exports = router;
