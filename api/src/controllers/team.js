/**
 * Controllers for team functionality
 * Author: 
 * Modified: 
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
const { query, body } = require("express-validator");

const statusResponses = require("../utils/status-response.js");

/*
 * Get all teams
 */
router.get("/view", (req, res) => {
  useService(teamService.getAll, req, res);
});

/*
 * Get all teams in a school
 */
router.get("/getSchoolTeams", (req, res) => {
  useService(teamService.get, req, res);
});

/*
 * Get all skill levels
 */
router.get("/levels", (req, res) => {
  useService(teamService.getAllSkillLevels, req, res);
});

/*
 * Get teams by event name
 */
router.get("/teamsEventName", (req, res) => {
  var name = req.query["eventName"];
  teamService
    .getTeamsInCompetitionName(name)
    .then((teamData) => {
      statusResponses.ok(res, teamData);
    })
    .catch((err) => {
      statusResponses.serverError(res);
    });
});

/*
 * Get all schools in an event
 */
router.get("/schoolevent", (req, res) => {
  let school = req.query["schoolId"];
  let competition = req.query["competitionId"];
  teamService
    .getSchoolEvent(school, competition)
    .then((teamData) => {
      statusResponses.ok(res, teamData);
    })
    .catch((err) => {
      statusResponses.serverError(res);
    });
});

/*
 * Returns the teams from all schools associated with an advisor
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
 * Returns team counts for a competition.
 */
router.get("/getTeamsInCompetition", (req, res) => {
  // TWP TODO: Do Role Checking
  useService(teamService.teamsInCompetition, req, res);
});

/*
 * Returns team counts for all schools for a competition.
 */
router.get("/getTeamsInCompetitionForAllSchools", (req, res) => {
  // TWP TODO: Do Role Checking
  useService(teamService.teamsInCompetitionForAllSchools, req, res);
});

/*
 * Returns a team's details
 */
router.get("/getTeamDetails", (req, res) => {
  // TWP TODO: Do Role Checking
  useService(teamService.getTeamDetails, req, res);
});
//******************************************************************************************************************************

/**
 * Get all teams
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  accessLevelCheck(constants.ADVISOR),
  [
    // generally just checking the optional parameters are the right type
    query("schoolId")
      .optional()
      .isInt()
      .withMessage("schoolId must be an integer"),
    query("competitionId")
      .optional()
      .isInt()
      .withMessage("competitionId must be an integer"),
    query("questionLevelId")
      .optional()
      .isInt()
      .withMessage("questionLevelId must be an integer"),
    query("advisorId")
      .optional()
      .isInt()
      .withMessage("advisorId must be an integer"),
    query("teamId").optional().isInt().withMessage("teamId must be an integer"),
    query("waitlisted")
      .optional()
      .isBoolean()
      .withMessage("waitlisted must be a boolean"),
  ],
  badRequestCheck,
  (req, res) => useService(teamService.get, req, res)
);

/**
 * Get waitlist info
 */
router.get(
  "/waitlistinfo",
  passport.authenticate("jwt", { session: false }),
  accessLevelCheck(constants.ADVISOR),
  [
    query("schoolId")
      .exists()
      .withMessage("schoolId is required")
      .isInt()
      .withMessage("schoolId must be an int"),
  ],
  badRequestCheck,
  (req, res) => useService(teamService.waitlistInfo, req, res)
);

/**
 * Create a team
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
  (req, res) => useService(teamService.create, req, res)
);

/**
 * Update a Team
 */
router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  accessLevelCheck(constants.ADVISOR),
  [
    // checking that there is a all the required parameters and that they are the right type
    body("teamId")
      .exists()
      .withMessage("teamId is required")
      .isInt()
      .withMessage("teamId must be an integer"),
    body("teamName")
      .optional()
      .isString()
      .withMessage("teamName must be a string")
      .not()
      .isEmpty()
      .withMessage("teamName cannot be an empty string"),
    body("questionLevelId")
      .optional()
      .isInt()
      .withMessage("questionLevelId must be an integer"),
    body("waitlisted")
      .optional()
      .isBoolean()
      .withMessage("waitlisted must be a boolean"),
    // if not waitlisted, make sure adding this team would not exceed the maximum number of teams in the competition / for the school
    // but only if not an admin or higher
    body("waitlisted").custom((waitlisted, { req }) => {
      if (waitlisted || req.user.accessLevel >= constants.ADMIN) {
        return true;
      }
      return teamService.getTeamInfo(req.body.teamId).then((teamInfo) => {
        const competitionId = teamInfo.competitionId;
        return Promise.all([
          eventService.getCompetitionTeamsInfo(competitionId),
          teamService.teamsInCompetition(competitionId),
          teamService.teamsInCompetitionBySchool(
            competitionId,
            teamInfo.schoolId
          ),
        ]).then(
          ([
            competitionTeamsInfo,
            teamsInCompetition,
            teamsInCompetitionBySchool,
          ]) => {
            if (
              competitionTeamsInfo.beginnerTeamsPerSchool <=
              teamsInCompetitionBySchool.beginnerTeamCount
            ) {
              throw new Error(
                "There are already the maximum number of beginner teams in this school for this competition"
              );
            } else if (
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
              competitionTeamsInfo.beginnerTeamsPerEvent <=
              teamsInCompetition.beginnerTeamCount
            ) {
              throw new Error(
                "There are already the maximum number of beginner teams in this competition"
              );
            } else if (
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
      });
    }),
    body("studentIds")
      .optional()
      .isArray()
      .withMessage("studentIds must be an array"),
    body("studentIds.*")
      .optional()
      .isInt()
      .withMessage("studentIds must be an array of integers"),
    // make sure no student is in any other team in the competition
    body("studentIds")
      .optional()
      .custom((studentIds, { req }) => {
        return teamService
          .getCompetitionId(req.body.teamId)
          .then((competitionId) => {
            return teamService
              .isAnyStudentsInCompetition(competitionId, studentIds)
              .then((alreadyInATeam) => {
                if (alreadyInATeam) {
                  throw new Error(
                    "One or more of the students is already in a team in this competition"
                  );
                }
                return true;
              });
          });
      }),
    body("teamName")
      .optional()
      .isString()
      .withMessage("teamName must be a string")
      .not()
      .isEmpty()
      .withMessage("teamName cannot be an empty string"),
    body("questionLevelId")
      .optional()
      .isInt()
      .withMessage("questionLevelId must be an integer"),
  ],
  badRequestCheck,
  (req, res) => useService(teamService.update, req, res)
);

/**
 * Remove a team or member
 */
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  accessLevelCheck(constants.ADVISOR),
  [
    // checking that there is a all the required parameters and that they are the right type
    body("teamId").isInt().withMessage("teamId must be an integer"),
    // check that the team exists
    body("teamId").custom((id) => {
      return teamService.get({ teamId: id }).then((team) => {
        if (!team || team.length === 0) {
          throw new Error("Team does not exist");
        }
        return true;
      });
    }),
    body("studentId")
      .optional()
      .isInt()
      .withMessage("studentId must be an integer"),
  ],
  badRequestCheck,
  (req, res) => useService(teamService.remove, req, res)
);

module.exports = router;
