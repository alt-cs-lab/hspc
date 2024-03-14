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
const { query, body } = require("express-validator");

//******************************************************************************************************************************
// Code Added for curent end points required in the client
const statusResponses = require("../utils/status-response.js");

router.get("/view", (req, res) => {useService(teamService.getAll, req, res)})

router.get("/getSchoolTeams", (req, res) => {useService(teamService.get, req, res)})

router.get("/levels", (req, res) => {useService(teamService.getAllSkillLevels, req, res)})

/*
* API Endpoint used to search for teams by event name.
*
* @author: Tyler Trammell
* @param {string} endpoint location
* @param {JSON} callback function containing request and response data from the client.
*/
router.get('/teamsEventName', (req, res) => {
    var name = req.query['eventName'];
    teamService.getTeamsInCompetitionName(name)
        .then((teamData) => {
            statusResponses.ok(res, teamData);
        })
        .catch((err) => {
            statusResponses.serverError(res);
        });
});

router.get('/schoolevent', (req, res) => {
    let school = req.query["schoolId"];
    let competition = req.query["competitionId"];
    teamService.getSchoolEvent(school, competition)
        .then((teamData) => {
            statusResponses.ok(res, teamData);
        })
        .catch((err) => {
            statusResponses.serverError(res);
        });

});

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
//******************************************************************************************************************************

/**
 * @api {get} /team Get Teams
 * @apiName GetTeams
 * @apiGroup Team
 * @apiHeader {String} Authorization User's access token prefixed with "Bearer "
 * @apiDescription Returns a list of teams. Only advisors and admins have access to this endpoint.
 * @apiParam (Query Params) {Number} [schoolId] ID of the school to filter teams by.
 * @apiParam (Query Params) {Number} [competitionId] ID of the competition to filter teams by.
 * @apiParam (Query Params) {Number} [questionLevelId] ID of the question level to filter teams by.
 * @apiParam (Query Params) {Number} [advisorId] ID of the advisor to filter teams by.
 * @apiParam (Query Params) {Number} [teamId] ID of a specific team to retrieve.
 * @apiParam (Query Params) {Boolean} [waitlisted] Whether or not to filter teams by waitlisted status.
 * @apiSuccess {Object[]} teams List of teams.
 * @apiSuccess {Number} teams.id ID of the team.
 * @apiSuccess {Number} teams.schoolId ID of the school that the team is from.
 * @apiSuccess {Number} teams.competitionId ID of the competition that the team is in.
 * @apiSuccess {String} teams.teamName Name of the team.
 * @apiSuccess {Number} teams.questionLevelId ID of the question level that the team is in. Should be 1 for beginner and 2 for advanced.
 * @apiSuccess {Number} teams.advisorId ID of the advisor that the team is affiliated with.
 * @apiSuccess {Object[]} teams.members Array of students that are part of the team. Only returned when getting a specific team.
 * @apiSuccess {Number} teams.members.id ID of the student.
 * @apiSuccess {String} teams.members.firstName First name of the student.
 * @apiSuccess {String} teams.members.lastName Last name of the student.
 * @apiSuccess {String} teams.members.email Email of the student.
 *
 * @apiError (400 Bad Request) {String} message Error message.
 * @apiError (401 Unauthorized) {String} message Error message.
 * @apiError (500 Internal Server Error) {String} message Error message.
 */
router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    accessLevelCheck(constants.ADVISOR),
    [
        // generally just checking the optional parameters are the right type
        query("schoolId").optional().isInt().withMessage("schoolId must be an integer"),
        query("competitionId").optional().isInt().withMessage("competitionId must be an integer"),
        query("questionLevelId").optional().isInt().withMessage("questionLevelId must be an integer"),
        query("advisorId").optional().isInt().withMessage("advisorId must be an integer"),
        query("teamId").optional().isInt().withMessage("teamId must be an integer"),
        query("waitlisted").optional().isBoolean().withMessage("waitlisted must be a boolean"),
    ],
    badRequestCheck,
    (req, res) => useService(teamService.get, req, res)
);

/**
 * @api {get} /team Get Teams
 * @apiName GetWaitlistInfo
 * @apiGroup Team
 * @apiHeader {String} Authorization User's access token prefixed with "Bearer "
 * @apiDescription Returns details on current waitlist status.
 * @apiParam (Query Params) {Number} [schoolId] ID of the school to filter teams by.
 * @apiSuccess {boolean} beginnerWaitlist A value indicating whether future beginner teams will be waitlisted.
 * @apiSuccess {boolean} advancedWaitlist A value indicating whether future advanced teams will be waitlisted.
 *
 * @apiError (400 Bad Request) {String} message Error message.
 * @apiError (401 Unauthorized) {String} message Error message.
 * @apiError (500 Internal Server Error) {String} message Error message.
 */
router.get(
    "/waitlistinfo",
    passport.authenticate("jwt", { session: false }),
    accessLevelCheck(constants.ADVISOR),
    [
        query("schoolId")
            .exists().withMessage("schoolId is required")
            .isInt().withMessage("schoolId must be an int")
    ],
    badRequestCheck,
    (req, res) => useService(teamService.waitlistInfo, req, res)
)

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
    "/",
    passport.authenticate("jwt", { session: false }),
    accessLevelCheck(constants.ADVISOR),
    [
        // checking that there is a all the required parameters and that they are the right type
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
        // teamName can't be an empty string
        body("teamName")
            .exists()
            .withMessage("teamName is required")
            .isString()
            .withMessage("teamName must be a string")
            .not()
            .isEmpty()
            .withMessage("teamName cannot be an empty string"),
        body("questionLevelId")
            .exists()
            .withMessage("questionLevelId is required")
            .isInt()
            .withMessage("questionLevelId must be an integer"),
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
            const isBeginner = req.body.questionLevelId === 1

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
            // check that no student is in any other team in the competition
            return teamService.isAnyStudentsInCompetition(req.body.competitionId, studentIds).then((alreadyInATeam) => {
                if (alreadyInATeam) {
                    throw new Error("One or more of the students is already in a team in this competition");
                }
                return true;
            });
        }),
    ],
    badRequestCheck,
    (req, res) => useService(teamService.create, req, res)
);

/**
 * @api {put} /team Update Team
 * @apiName UpdateTeam
 * @apiGroup Team
 * @apiHeader {String} Authorization User's access token prefixed with "Bearer "
 * @apiDescription Updates a team. Only advisors and admins have access to this endpoint.
 * @apiParam (Body Params) {Number} teamId ID of the team to update.
 * @apiParam (Body Params) {String} [teamName] Name of the team.
 * @apiParam (Body Params) {Number} [questionLevelId] ID of the question level that the team is in. Should be 1 for beginner and 2 for advanced.
 * @apiParam (Body Params) {Boolean} [waitlisted] Whether or not the team is waitlisted.
 * @apiParam (Body Params) {Number[]} [studentIds] Array of student IDs to add to the team.
 *
 * @apiError (400 Bad Request) {String} message Error message.
 * @apiError (401 Unauthorized) {String} message Error message.
 * @apiError (500 Internal Server Error) {String} message Error message.
 */
router.put(
    "/",
    passport.authenticate("jwt", { session: false }),
    accessLevelCheck(constants.ADVISOR),
    [
        // checking that there is a all the required parameters and that they are the right type
        body("teamId").exists().withMessage("teamId is required").isInt().withMessage("teamId must be an integer"),
        body("teamName").optional().isString().withMessage("teamName must be a string").not().isEmpty().withMessage("teamName cannot be an empty string"),
        body("questionLevelId").optional().isInt().withMessage("questionLevelId must be an integer"),
        body("waitlisted").optional().isBoolean().withMessage("waitlisted must be a boolean"),
        // if not waitlisted, make sure adding this team would not exceed the maximum number of teams in the competition / for the school
        // but only if not an admin or higher
        body("waitlisted").custom((waitlisted, {req}) => {
            if (waitlisted || req.user.accessLevel >= constants.ADMIN) {
                return true;
            }
            return teamService.getTeamInfo(req.body.teamId).then((teamInfo) => {
                const competitionId = teamInfo.competitionId;
                return Promise.all([
                    eventService.getCompetitionTeamsInfo(competitionId),
                    teamService.teamsInCompetition(competitionId),
                    teamService.teamsInCompetitionBySchool(competitionId, teamInfo.schoolId),
                ]).then(([competitionTeamsInfo, teamsInCompetition, teamsInCompetitionBySchool]) => {
                    if (competitionTeamsInfo.beginnerTeamsPerSchool <= teamsInCompetitionBySchool.beginnerTeamCount ) {
                        throw new Error("There are already the maximum number of beginner teams in this school for this competition");
                    } else if (competitionTeamsInfo.advancedTeamsPerSchool <= teamsInCompetitionBySchool.advancedTeamCount ) {
                        throw new Error("There are already the maximum number of advanced teams in this school for this competition");
                    } else if (competitionTeamsInfo.teamsPerSchool <= teamsInCompetitionBySchool.teamCount ) {
                        throw new Error("There are already the maximum number of teams in this school for this competition");
                    } else if (competitionTeamsInfo.beginnerTeamsPerEvent <= teamsInCompetition.beginnerTeamCount ) {
                        throw new Error("There are already the maximum number of beginner teams in this competition");
                    } else if (competitionTeamsInfo.advancedTeamsPerEvent <= teamsInCompetition.advancedTeamCount ) {
                        throw new Error("There are already the maximum number of advanced teams in this competition");
                    } else if (competitionTeamsInfo.teamsPerEvent <= teamsInCompetition.teamCount ) {
                        throw new Error("There are already the maximum number of teams in this competition");
                    }
                    return true;
                });
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
        body("studentIds").optional().custom((studentIds, {req}) => {
            return teamService.getCompetitionId(req.body.teamId).then((competitionId) => {
                return teamService.isAnyStudentsInCompetition(competitionId, studentIds).then((alreadyInATeam) => {
                    if (alreadyInATeam) {
                        throw new Error("One or more of the students is already in a team in this competition");
                    }
                    return true;
                });
            });
        }),
        body("teamName").optional().isString().withMessage("teamName must be a string").not().isEmpty().withMessage("teamName cannot be an empty string"),
        body("questionLevelId").optional().isInt().withMessage("questionLevelId must be an integer"),
    ],
    badRequestCheck,
    (req, res) => useService(teamService.update, req, res)
);

/**
 * @api {delete} /team Remove Team/Member
 * @apiName RemoveTeam/Member
 * @apiGroup Team
 * @apiHeader {String} Authorization User's access token prefixed with "Bearer "
 * @apiDescription Removes a team or a member from a team. Only advisors and admins have access to this endpoint.
 * @apiParam (Body Params) {Number} teamId ID of the team to remove.
 * @apiParam (Body Params) {Number} [studentId] ID of the student to remove from the team.
 *
 * @apiError (400 Bad Request) {String} message Error message.
 * @apiError (401 Unauthorized) {String} message Error message.
 * @apiError (500 Internal Server Error) {String} message Error message.
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
            return teamService.get({teamId: id}).then((team) => {
                if (!team || team.length === 0) {
                    throw new Error("Team does not exist");
                }
                return true;
            });
        }),
        body("studentId").optional().isInt().withMessage("studentId must be an integer"),
    ],
    badRequestCheck,
    (req, res) => useService(teamService.remove, req, res)
);

module.exports = router;
