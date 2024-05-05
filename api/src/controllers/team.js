/*
 * Controllers for team functionality
 * Author: Devin Richards
 * Modified: 5/4/2024
 */
const router = require("express").Router();
const teamService = require("../services/team");
const eventService = require("../services/event");
const passport = require("passport");
const {
  accessLevelCheck,
  badRequestCheck,
  useService,
} = require("../utils/extensions");
const constants = require("../utils/constants");
const { body } = require("express-validator");
const statusResponses = require("../utils/status-response.js");

/**
 * Calls the API and returns all teams
 */
router.get("/view", (req, res) => {
  useService(teamService.getAllTeams, req, res);
});

/**
 * Calls the API and returns all skill levels
 */
router.get("/levels", (req, res) => {
  useService(teamService.getAllSkillLevels, req, res);
});

/**
 * Calls the API and returns the teams from all schools associated with an advisor
 */
router.get("/getFromAdvisorSchools", (req, res) => {
  // TWP TODO: Do Role Checking
  var advisorId = req.query["advisorId"];
  teamService
    .getAdvisorSchoolsTeams(advisorId)
    .then((teamData) => {
      statusResponses.ok(res, teamData);
    })
    .catch((err) => {
      statusResponses.serverError(res);
    });
});

/*
 * Calls the API and returns team counts for a competition.
 */
router.get("/getTeamsInCompetition", (req, res) => {
  // TWP TODO: Do Role Checking
  useService(teamService.teamsInCompetition, req, res);
});

/*
 * Calls the API and returns team counts for all schools for a competition.
 */
router.get("/getTeamsInCompetitionForAllSchools", (req, res) => {
  // TWP TODO: Do Role Checking
  useService(teamService.teamsInCompetitionForAllSchools, req, res);
});

/*
 * Calls the API and returns a team's details
 */
router.get("/getTeamDetails", (req, res) => {
  // TWP TODO: Do Role Checking
  useService(teamService.getTeamDetails, req, res);
});

/*
 * Calls the API to create a team
 */
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  accessLevelCheck(constants.ADVISOR),
  [
    body("teamName")
      .exists()
      .withMessage("teamName is required")
      .isString()
      .withMessage("teamName must be a string")
      .not()
      .isEmpty()
      .withMessage("teamName cannot be an empty string"),
    body("schoolId")
      .exists()
      .withMessage("schoolId is required")
      .isInt()
      .withMessage("schoolId must be an integer"),
    body("competitionId")
      .exists()
      .withMessage("competitionId is required")
      .isInt()
      .withMessage("competitionId must be an integer"),
    body("skillLevelId")
      .exists()
      .withMessage("skillLevelId is required")
      .isInt()
      .withMessage("skillLevelId must be an integer"),
    body("advisorId")
      .exists()
      .withMessage("advisorId is required")
      .isInt()
      .withMessage("advisorId must be an integer"),
    body("waitlisted")
      .optional()
      .isBoolean()
      .withMessage("waitlisted must be a boolean"),
    // also check that adding this team would not exceed the maximum number of teams in the competition / for the school
    body("waitlisted").custom((waitlisted, { req }) => {
      // if the team is waitlisted or the user is an admin or higher we can ignore this check
      if (waitlisted || req.user.accessLevel >= constants.ADMIN) {
        return true;
      }
      const isBeginner = req.body.skillLevelId === 1;

      return Promise.all([
        eventService.getCompetitionTeamsInfo(req.body.competitionId),
        teamService.teamsInCompetition(req.body.competitionId),
        teamService.teamsInCompetitionBySchool(
          req.body.competitionId,
          req.body.schoolId
        ),
      ]).then(
        ([
          competitionTeamsInfo,
          teamsInCompetition,
          teamsInCompetitionBySchool,
        ]) => {
          if (
            isBeginner &&
            competitionTeamsInfo.beginnerTeamsPerSchool <=
              teamsInCompetitionBySchool.beginnerTeamCount
          ) {
            throw new Error(
              "There are already the maximum number of beginner teams in this school for this competition"
            );
          } else if (
            !isBeginner &&
            competitionTeamsInfo.advancedTeamsPerSchool <=
              teamsInCompetitionBySchool.advancedTeamCount
          ) {
            throw new Error(
              "There are already the maximum number of advanced teams in this school for this competition"
            );
          } else if (
            competitionTeamsInfo.teamsPerSchool <=
            teamsInCompetitionBySchool.teamCount
          ) {
            throw new Error(
              "There are already the maximum number of teams in this school for this competition"
            );
          } else if (
            isBeginner &&
            competitionTeamsInfo.beginnerTeamsPerEvent <=
              teamsInCompetition.beginnerTeamCount
          ) {
            throw new Error(
              "There are already the maximum number of beginner teams in this competition"
            );
          } else if (
            !isBeginner &&
            competitionTeamsInfo.advancedTeamsPerEvent <=
              teamsInCompetition.advancedTeamCount
          ) {
            throw new Error(
              "There are already the maximum number of advanced teams in this competition"
            );
          } else if (
            competitionTeamsInfo.teamsPerEvent <= teamsInCompetition.teamCount
          ) {
            throw new Error(
              "There are already the maximum number of teams in this competition"
            );
          }
          return true;
        }
      );
    }),
    body("studentIds")
      .optional()
      .isArray()
      .withMessage("studentIds must be an array"),
    body("studentIds.*")
      .optional()
      .isInt()
      .withMessage("studentIds must be an array of integers"),
    body("studentIds")
      .optional()
      .custom((studentIds, { req }) => {
        // Check that no student is in any other team in the competition.
        return teamService
          .isAnyStudentsInCompetition(req.body.competitionId, studentIds)
          .then((alreadyInATeam) => {
            if (alreadyInATeam) {
              throw new Error(
                "One or more students are already in a team for this competition."
              );
            }
            return true;
          });
      }),
  ],
  badRequestCheck,
  (req, res) => useService(teamService.createTeam, req, res)
);

module.exports = router;
