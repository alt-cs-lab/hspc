/*
 * Controllers for participant functionality
 * Author: 
 * Modified: 
 */
const router = require("express").Router();
const statusResponses = require("../utils/status-response.js");
const participantService = require("../services/participant.js");
const { useService } = require("../utils/extensions.js");
const passport = require("passport");
const { accessLevelCheck, badRequestCheck } = require("../utils/extensions.js");
const { check } = require("express-validator");
const constants = require("../utils/constants.js");
/*
 * API Endpoint serving the addition of existing teams to a pre-exisiting event.
 */
router.post("/create", (req, res) => {
  const TeamName = req.body["TeamName"];
  const SchoolName = req.body["SchoolName"];
  const StateCode = req.body["StateCode"];
  const QuestionLevel = req.body["QuestionLevel"];
  const EventDate = req.body["EventDate"];

  /*
   * checks if team and event combination already exists
   */
  participantService
    .getAllParticipants()
    .then((teamData) => {
      for (let i = 0; i < teamData.length; i++) {
        if (
          teamData[i].TeamName === TeamName &&
          teamData[i].EventDate === EventDate
        ) {
          return statusResponses.conflict(
            res,
            `'${email}' could not be registered`
          );
        }
      }
      participantService
        .addParticipant(
          TeamName,
          SchoolName,
          StateCode,
          QuestionLevel,
          EventDate
        )
        .then(() => {
          statusResponses.created(res, `Team Registered to Event!`);
        })
        .catch((err) => {
          statusResponses.serverError(res);
        });
    })
    .catch((err) => {
      statusResponses.serverError(res);
    });
});

/*
 * API Endpoint that returns all users participants in a given event.
 */
router.get("/view", (req, res) => {
  participantService
    .getAllParticipants()
    .then((teamData) => {
      statusResponses.ok(res, teamData);
    })
    .catch((err) => {
      statusResponses.serverError(res);
    });
});

module.exports = router;
