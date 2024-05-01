/*
 * Controllers for request functionality
 * Author:
 * Modified:
 */
const router = require("express").Router();
const passport = require("passport");
const {
  badRequestCheck,
  useService,
  accessLevelCheck,
} = require("../utils/extensions.js");
const constants = require("../utils/constants.js");
const requestService = require("../services/request");
const statusResponses = require("../utils/status-response.js");

/*
 * Calls the API and returns a JSON list of all advisors' school requests.
 */
router.get("/allSchool", (req, res) => {
  // TWP TODO: Do Role Checking
  requestService
    .getAllSchoolRequests()
    .then((studentData) => {
      statusResponses.ok(res, studentData);
    })
    .catch((err) => {
      statusResponses.serverError(res);
    });
});

/*
 * Calls the API and approves or denies a specific advisor's school request.
 */
router.post("/completeSchool", (req, res) => {
  // TWP TODO: Do Role Checking
  useService(requestService.completeSchoolRequest, req, res);
});

/*
 * Calls the API and requests an additional school for a specific advisor
 */
router.post("/requestSchool", (req, res) => {
  // TWP TODO: Do Role Checking
  useService(requestService.requestSchool, req, res);
});

/*
 * Calls the API and approves or denies a specific team's waitlisted condition.
 */
router.post("/completeTeamRegistration", (req, res) => {
  // TWP TODO: Do Role Checking
  useService(requestService.completeTeamRegistration, req, res);
});

/*
 * Calls the API and returns a JSON list of all waitlisted teams in an event
 */
router.get("/waitlistedTeamsForEvent", (req, res) => {
  // TWP TODO: Do Role Checking
  useService(requestService.requestWaitlistedTeamsForEvent, req, res);
});

module.exports = router;
