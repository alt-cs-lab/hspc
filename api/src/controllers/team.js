/**
 * @fileoverview Controller for the team routes.
 * @author Riley Mueller
 *
 * The database has a Teams table that takes in the following parameters:
 * SchoolID -- The ID of the school that the team is from.
 * CompetitionID -- The ID of the competition that the team is in.
 * TeamName -- The name of the team.
 * QuestionLevelID -- The ID of the question level that the team is in. Should be 1 for beginner and 2 for advanced.
 * AdvisorID -- The ID of the advisor that the team is affiliated with.
 * Waitlisted -- Whether or not the team is waitlisted.
 *
 * Database stores CapitalizedWords but everywhere else we use camelCase with ID as Id.
 *
 * Only advisors and admins have access to this endpoint and only advisors can create and add students to teams.
 * This is because Students have an Advisor Student relation.
 *
 * The routes:
 * GET /team -- By default, returns all teams
 * GET /team?schoolId= -- Returns all teams from a specific school
 * GET /team?competitionId= -- Returns all teams from a specific competition
 * GET /team?questionLevelId= -- Returns all teams from a specific question level
 * GET /team?advisorId= -- Returns all teams from a specific advisor
 * GET /team?teamId= -- Returns a specific team with all its members.
 * GET /team?waitlisted= -- Returns all teams that are waitlisted or not waitlisted
 * POST /team -- Creates a new team, body should hold the parameters and optionally an array of studentIds
 * PUT /team -- Add students to a team, body should hold the teamId and an array of studentIds, teamName and questionLevelId are optional
 * DELETE will delete a team unless the route is provided with a studentId, in which case it will remove the student from the team
 * DELETE /team?teamId= -- Deletes a team
 * DELETE /team?teamId=&studentId= -- Removes a student from a team
 */

const router = require("express").Router();
const teamService = require("../services/team");
const eventService = require("../services/event");
const passport = require("passport");
const { accessLevelCheck, badRequestCheck, useService } = require("../utils/extensions");
const constants = require("../utils/constants");
const { body } = require("express-validator");

//******************************************************************************************************************************
// Code Added for curent end points required in the client
const statusResponses = require("../utils/status-response.js");

router.get("/view", (req, res) => {useService(teamService.getAllTeams, req, res)})

router.get("/levels", (req, res) => {useService(teamService.getAllSkillLevels, req, res)})

/*
* Calls the API and returns the teams from all schools associated with an advisor.
* Author: Trent Powell
*/
router.get('/getFromAdvisorSchools', (req, res) => {
    // TWP TODO: Do Role Checking
    var advisorId = req.query['advisorId'];
    teamService.getAdvisorSchoolsTeams(advisorId)
    .then((teamData) => {
        statusResponses.ok(res, teamData);
    })
    .catch((err) => {
        statusResponses.serverError(res);
    });
});

/*
* Calls the API and returns team counts for a competition.
* Author: Trent Powell
*/
router.get('/getTeamsInCompetition', (req, res) => {
    // TWP TODO: Do Role Checking
    useService(teamService.teamsInCompetition, req, res);
});

/*
* Calls the API and returns team counts for all schools for a competition.
* Author: Trent Powell
*/
router.get('/getTeamsInCompetitionForAllSchools', (req, res) => {
    // TWP TODO: Do Role Checking
    useService(teamService.teamsInCompetitionForAllSchools, req, res);
});

/*
* Calls the API and returns team counts for all schools for a competition.
* Author: Trent Powell
*/
router.get('/getTeamDetails', (req, res) => {
    // TWP TODO: Do Role Checking
    useService(teamService.getTeamDetails, req, res);
});

/**
 * @api {post} /team Create Team
 * @apiName CreateTeam
 * @apiGroup Team
 * @apiHeader {String} Authorization User's access token prefixed with "Bearer "
 * @apiDescription Creates a new team. Only advisors and admins have access to this endpoint.
 * @apiParam (Body Params) {Number} schoolId ID of the school that the team is from.
 * @apiParam (Body Params) {Number} competitionId ID of the competition that the team is in.
 * @apiParam (Body Params) {String} teamName Name of the team.
 * @apiParam (Body Params) {Number} questionLevelId ID of the question level that the team is in. Should be 1 for beginner and 2 for advanced.
 * @apiParam (Body Params) {Number} advisorId ID of the advisor that the team is affiliated with.
 * @apiParam (Body Params) {Boolean} [waitlisted] Whether or not the team is waitlisted.
 * @apiParam (Body Params) {Number[]} [studentIds] Array of student IDs to add to the team.
 * @apiSuccess (Success 200) {Number} id ID of the team.
 *
 * @apiError (400 Bad Request) {String} message Error message.
 * @apiError (401 Unauthorized) {String} message Error message.
 * @apiError (500 Internal Server Error) {String} message Error message.
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
        body("waitlisted").optional().isBoolean().withMessage("waitlisted must be a boolean"),
        // also check that adding this team would not exceed the maximum number of teams in the competition / for the school
        body("waitlisted").custom((waitlisted, {req}) => {
            // if the team is waitlisted or the user is an admin or higher we can ignore this check
            if (waitlisted || req.user.accessLevel >= constants.ADMIN) {
                return true;
            }
            const isBeginner = req.body.skillLevelId === 1

            return Promise.all([
                eventService.getCompetitionTeamsInfo(req.body.competitionId),
                teamService.teamsInCompetition(req.body.competitionId),
                teamService.teamsInCompetitionBySchool(req.body.competitionId, req.body.schoolId),
            ]).then(([competitionTeamsInfo, teamsInCompetition, teamsInCompetitionBySchool]) => {
                if (isBeginner && competitionTeamsInfo.beginnerTeamsPerSchool <= teamsInCompetitionBySchool.beginnerTeamCount ) {
                    throw new Error("There are already the maximum number of beginner teams in this school for this competition");
                } else if (!isBeginner && competitionTeamsInfo.advancedTeamsPerSchool <= teamsInCompetitionBySchool.advancedTeamCount ) {
                    throw new Error("There are already the maximum number of advanced teams in this school for this competition");
                } else if (competitionTeamsInfo.teamsPerSchool <= teamsInCompetitionBySchool.teamCount ) {
                    throw new Error("There are already the maximum number of teams in this school for this competition");
                } else if (isBeginner && competitionTeamsInfo.beginnerTeamsPerEvent <= teamsInCompetition.beginnerTeamCount ) {
                    throw new Error("There are already the maximum number of beginner teams in this competition");
                } else if (!isBeginner && competitionTeamsInfo.advancedTeamsPerEvent <= teamsInCompetition.advancedTeamCount ) {
                    throw new Error("There are already the maximum number of advanced teams in this competition");
                } else if (competitionTeamsInfo.teamsPerEvent <= teamsInCompetition.teamCount ) {
                    throw new Error("There are already the maximum number of teams in this competition");
                }
                return true;
            });
        }),
        body("studentIds").optional().isArray().withMessage("studentIds must be an array"),
        body("studentIds.*").optional().isInt().withMessage("studentIds must be an array of integers"),
        body("studentIds").optional().custom((studentIds, {req}) => {
            // Check that no student is in any other team in the competition.
            return teamService.isAnyStudentsInCompetition(req.body.competitionId, studentIds).then((alreadyInATeam) => {
                if (alreadyInATeam) {
                    throw new Error("One or more students are already in a team for this competition.");
                }
                return true;
            });
        }),
    ],
    badRequestCheck,
    (req, res) => useService(teamService.createTeam, req, res)
);

module.exports = router;
