/**
 * @fileoverview Team service
 * @author Riley Mueller
 *
 * Has functions for get, create, update, and remove
 */

// import the database
const db = require("../utils/hspc_db").db;
// used for formating the data from the database to be more readable
const { renameKeys } = require("../utils/extensions");
const constants = require("../utils/constants");
const { Int } = require("mssql");
const { getCompetitionTeamsInfo } = require("./event");
const pgp = require("pg-promise")();

// every function is given an object as a parameter

// get returns a list of teams, will filter on any present parameters
function get({ schoolId, competitionId, questionLevelId, advisorId, teamId }) {
    // create a transaction
    return db.tx(async (t) => {
        // filter on the schoolId, competitionId, questionLevelId, advisorId, and teamId if it is given
        let whereList = [];
        let values = {};
        if (schoolId) {
            whereList.push(`T.SchoolID = $(schoolId)`);
            values.schoolId = schoolId;
        }
        if (competitionId) {
            whereList.push(`T.CompetitionID = $(competitionId)`);
            values.competitionId = competitionId;
        }
        if (questionLevelId) {
            whereList.push(`T.QuestionLevelID = $(questionLevelId)`);
            values.questionLevelId = questionLevelId;
        }
        if (advisorId) {
            whereList.push(`T.AdvisorID = $(advisorId)`);
            values.advisorId = advisorId;
        }
        if (teamId) {
            whereList.push(`T.TeamID = $(teamId)`);
            values.teamId = teamId;
        }
        // create the query
        let query = `SELECT T.TeamID, T.SchoolID, T.CompetitionID, T.TeamName, T.QuestionLevelID, T.AdvisorID,  T.TimeCreated FROM Teams T`;
        // filter on the schoolId, competitionId, questionLevelId, advisorId, and teamId, if given
        if (whereList.length > 0) {
            query += ` WHERE ${whereList.join(" AND ")}`;
        }
        // retrieve the teams
        const teams = await t.any(query, values);
        // rename the keys of each team object and return the teams
        const response = renameKeys(teams, [
            "teamId",
            "schoolId",
            "competitionId",
            "teamName",
            "questionLevelId",
            "advisorId",
            "timeCreated",
        ]);

        // if teamId is given, retrieve the team members
        if (teamId && response?.length > 0) {
            // retrieve the user IDs of the team members
            const rawUserIds = await t.any(`SELECT UserID FROM TeamsUsers WHERE TeamID = $(teamId)`, { teamId });
            if (rawUserIds?.length > 0) {
                // userIds is an array of the user IDs
                const userIds = rawUserIds.map((obj) => obj.userid);
                // retrieve the user data for each team member
                const users = await t.any(`SELECT UserID, FirstName, LastName, Email FROM Users WHERE UserID IN ($1:csv)`, [
                    userIds,
                ]);
                // rename the keys of each user object and add the users to the team
                response[0].members = renameKeys(users, ["userId", "firstName", "lastName", "email"]);
            }
        }

        return response;
    });
}

// create creates a new team and adds any students in studentIds
function create({ schoolId, competitionId, teamName, questionLevelId, advisorId, studentIds }) {
    // start a transaction
    return db.tx(async (t) => {
        // insert the team into the Teams table
        const result = await t.one(
            `INSERT INTO Teams (SchoolID, CompetitionID, TeamName, QuestionLevelID, AdvisorID) VALUES ($(schoolId), $(competitionId), $(teamName), $(questionLevelId), $(advisorId)) RETURNING TeamID`,
            { schoolId, competitionId, teamName, questionLevelId, advisorId }
        );
        const teamId = result.teamid;

        // if teamId is undefined, throw an error
        if (!teamId) {
            throw new Error("Team was not created");
        }

        // add the students to the team if there are any (studentIds might be null or an empty array)
        if (studentIds?.length > 0) {
            // create an array of objects to pass to pgp.helpers.insert
            const values = studentIds.map((studentId) => ({ UserID: studentId, TeamID: teamId }));

            // generate the insert query using pgp.helpers.insert
            const insertQuery = pgp.helpers.insert(values, ["UserID", "TeamID"], "TeamsUsers");

            // execute the insert query as part of the transaction
            await t.none(insertQuery.toLowerCase());
        }

        return { teamId: teamId };
    });
}

// update updates a team, will add all students in studentIds to the team.
function update({ teamId, studentIds, teamName, questionLevelId }) {
    // start a transaction
    return db.tx(async (t) => {        
        // add the students to the team
        if (studentIds?.length > 0) {
            const insertValues = studentIds.map((studentId) => ({ UserID: studentId, TeamID: teamId }));
            const query = pgp.helpers.insert(insertValues, ["UserID", "TeamID"], "TeamsUsers");
            await t.none(query.toLowerCase());
        }
        // update the questionLevelId and teamName if they are given
        if (questionLevelId) {
            await t.none(`UPDATE Teams SET QuestionLevelID = $(questionLevelId) WHERE TeamID = $(teamId)`, {
                questionLevelId,
                teamId,
            });
        }
        if (teamName) {
            await t.none(`UPDATE Teams SET TeamName = $(teamName) WHERE TeamID = $(teamId)`, { teamName, teamId });
        }
    });
}

// remove removes a team and all of its students or just a student if studentId is given
function remove({ teamId, studentId }) {
    // start a transaction
    return db.tx(async (t) => {
        // if a studentId is given, remove that student from the team
        if (studentId) {
            await t.none(`DELETE FROM TeamsUsers WHERE TeamID = $(teamId) AND UserID = $(studentId)`, {
                teamId,
                studentId,
            });
        }
        // otherwise remove the entire team
        else {
            await t.none(`DELETE FROM TeamsUsers WHERE TeamID = $(teamId)`, { teamId });
            await t.none(`DELETE FROM Teams WHERE TeamID = $(teamId)`, { teamId });
        }
    });
}

// returns the number of teams in a competition
function teamsInCompetition(competitionId){
    // then parse to int
    return db.oneOrNone(`SELECT COUNT(*) FROM Teams WHERE CompetitionID = $(competitionId)`, {competitionId}).then((result) => parseInt(result.count));
}

// returns the number of teams a school has in a competition
function teamsInCompetitionBySchool(competitionId, schoolId){
    return db.oneOrNone(`SELECT COUNT(*) FROM Teams WHERE CompetitionID = $(competitionId) AND SchoolID = $(schoolId)`, {competitionId, schoolId}).then((result) => parseInt(result.count));
}

// checks if any student ids in the given array are a member of a team in the given competition, returns true if any are
function isAnyStudentsInCompetition(competitionId, studentIds){
    return db.oneOrNone(`SELECT COUNT(*) FROM TeamsUsers WHERE TeamID IN (SELECT TeamID FROM Teams WHERE CompetitionID = $1) AND UserID IN ($2:csv)`, [competitionId, studentIds]).then((result) => parseInt(result.count) > 0);
}

function getCompetitionId(teamId){
    return db.oneOrNone(`SELECT CompetitionID FROM Teams WHERE TeamID = $(teamId)`, {teamId}).then((result) => result.competitionid);
}



module.exports = {
    get,
    create,
    update,
    remove,
    teamsInCompetition,
    teamsInCompetitionBySchool,
    isAnyStudentsInCompetition,
    getCompetitionId,
};
