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

//*************************************************************************************************************************************************************
// Code Added for curent end points required in the client
function getAll(){
    return db.any(`
    SELECT T.TeamID, T.TeamName, SK.SkillLevel, S.SchoolName, S.AddressLine1, S.AddressLine2, S.City, S."State", S.USDCode, U.Email 
    FROM 
        Teams T
        INNER JOIN Questions Q ON T.SkillLevelID = Q.SkillLevelID
        INNER JOIN SkillLevels SK ON Q.SkillLevelID = SK.SkillLevelID
        INNER JOIN Schools S ON T.SchoolID = S.SchoolID  
        INNER JOIN Users U ON T.AdvisorID = U.UserID;`
)
}

function getAllSkillLevels(){
    return db.any('SELECT * FROM SkillLevels')
}

function getTeamsInCompetitionName(eventName){
    return db.any(`
    SELECT T.TeamID, T.TeamName, SK.SkillLevel, S.SchoolName, S.AddressLine1, S.AddressLine2, S.City, S."State", S.USDCode, U.Email 
    FROM 
        Teams T
        INNER JOIN Questions Q ON T.SkillLevelID = Q.SkillLevelID
        INNER JOIN SkillLevels SK ON Q.SkillevelID = SK.SkillLevelID
        INNER JOIN School S ON T.SchoolID = S.SchoolID  
        INNER JOIN Users U ON T.AdvisorID = U.UserID
        INNER JOIN Competition C ON T.CompetitionID = C.CompetitionID
    WHERE C.EventName = $(eventName);`, {eventName})
}

/*
* Returns the teams from all schools associated with an advisor.
* Author: Trent Powell
*/
function getAdvisorSchoolsTeams(advisorId) {
    return db.any(`
    SELECT T.TeamId, T.SchoolID, T.CompetitionID, T.TeamName, SK.SkillLevel, TS.Status
	FROM Teams T
    INNER JOIN Schools S on S.SchoolID = T.SchoolID
    INNER JOIN SkillLevels SK on SK.SkillLevelID = T.SkillLevelID
    INNER JOIN TeamStatus TS on TS.StatusID = T.TeamStatusID
	WHERE T.SchoolID IN (
        SELECT S2.SchoolID
        FROM Schools S2
        INNER JOIN SchoolAdvisors SA on S2.SchoolId = SA.SchoolId
        WHERE SA.UserID = $(advisorId)
    );`, {advisorId})
}


function getWaitlistInfo({schoolId}) {
    return Promise.all([
            eventService.getCompetitionTeamsInfo(req.body.competitionId),
            teamService.teamsInCompetition(req.body.competitionId),
            teamService.teamsInCompetitionBySchool(req.body.competitionId, req.body.schoolId),
        ]).then(([competitionTeamsInfo, teamsInCompetition, teamsInCompetitionBySchool]) => {
            const waitlistInfo = {
                beginnerWaitlist: false,
                advancedWaitlist: false,
            }

            if (competitionTeamsInfo.teamsPerEvent <= teamsInCompetition.teamCount) {
                waitlistInfo.beginnerWaitlist = true
                waitlistInfo.advancedWaitlist = true
            }

            waitlistInfo.beginnerWaitlist |= competitionTeamsInfo.beginnerTeamsPerSchool <= teamsInCompetitionBySchool.beginnerTeamCount
                || competitionTeamsInfo.beginnerTeamsPerEvent <= teamsInCompetition.beginnerTeamCount

            waitlistInfo.advancedWaitlist |= competitionTeamsInfo.advancedTeamsPerSchool <= teamsInCompetitionBySchool.advancedTeamCount
                || competitionTeamsInfo.advancedTeamsPerEvent <= teamsInCompetition.advancedTeamCount

            return waitlistInfo
        })
}

//*************************************************************************************************************************************************************

// get returns a list of teams, will filter on any present parameters
function get({ schoolId, competitionId, questionLevelId, advisorId, teamId, waitlisted }) {
    // create a transaction
    return db.tx(async (t) => {
        // filter on the schoolId, competitionId, questionLevelId, advisorId, teamId, and waitlisted if it is given
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
            whereList.push(`T.SkillLevelID = $(questionLevelId)`);
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
        if (waitlisted) {
            whereList.push(`T.TeamStatusID = $(waitlisted)`);
            values.waitlisted = waitlisted;
        }
        // create the query
        let query = `SELECT T.TeamID, T.SchoolID, T.CompetitionID, T.TeamName, T.QuestionLevelID, T.AdvisorID, T.Waitlisted, T.TimeCreated FROM Teams T`;
        // filter on the schoolId, competitionId, questionLevelId, advisorId, teamId and waitlisted if given
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
            "waitlisted",
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
function create({ schoolId, competitionId, teamName, questionLevelId, advisorId, waitlisted, studentIds }) {
    // if waitlisted is not given, set it to false
    if (!waitlisted) {
        waitlisted = false;
    }
    // start a transaction
    return db.tx(async (t) => {
        // insert the team into the Teams table
        const result = await t.one(
            `INSERT INTO Teams (SchoolID, CompetitionID, TeamName, QuestionLevelID, AdvisorID, Waitlisted) VALUES ($(schoolId), $(competitionId), $(teamName), $(questionLevelId), $(advisorId), $(waitlisted)) RETURNING TeamID`,
            { schoolId, competitionId, teamName, questionLevelId, advisorId, waitlisted }
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
function update({ teamId, studentIds, teamName, questionLevelId, waitlisted }) {
    // start a transaction
    return db.tx(async (t) => {        
        // add the students to the team
        if (studentIds?.length > 0) {
            const insertValues = studentIds.map((studentId) => ({ UserID: studentId, TeamID: teamId }));
            const query = pgp.helpers.insert(insertValues, ["UserID", "TeamID"], "TeamsUsers");
            await t.none(query.toLowerCase());
        }
        // set the waitlisted status of the team if it is given, may be true or false
        if (waitlisted !== undefined) {
            await t.none(`UPDATE Teams SET TeamStatusID = $(waitlisted) WHERE TeamID = $(teamId)`, {
                waitlisted,
                teamId,
            });
        }

        // update the questionLevelI and teamName if they are given
        if (questionLevelId) {
            await t.none(`UPDATE Teams SET SkillLevelID = $(questionLevelId) WHERE TeamID = $(teamId)`, {
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
function teamsInCompetition(competitionId, waitlisted = false){
    // then parse to int
    return db.oneOrNone(`
            SELECT
                COUNT(*) as teamCount,
                SUM(CASE QuestionLevelID when 1 then 1 else 0 end) as beginnerTeamCount,
                SUM(CASE QuestionLevelID when 2 then 1 else 0 end) as advancedTeamCount
            FROM Teams
            WHERE CompetitionID = $(competitionId) AND Waitlisted = $(waitlisted)`,
            {competitionId, waitlisted})
        // .then(countInfo => ({
        //     beginnerTeamCount: parseInt(countInfo.beginnerTeamCount),
        //     advancedTeamCount: parseInt(countInfo.advancedTeamCount),
        //     teamCount: parseInt(countInfo.teamCount),
        // }));
}

// returns the number of teams a school has in a competition
function teamsInCompetitionBySchool(competitionId, schoolId, waitlisted = false){
    return db.oneOrNone(`
            SELECT
                COUNT(*) as teamCount,
                SUM(CASE SkillLevelID when 1 then 1 else 0 end) as beginnerTeamCount,
                SUM(CASE SkillLevelID when 2 then 1 else 0 end) as advancedTeamCount
            FROM Teams
            WHERE CompetitionID = $(competitionId)
                AND SchoolID = $(schoolId)
                AND TeamStatusID = $(waitlisted)`,
            {competitionId, schoolId, waitlisted})
        .then(countInfo => ({
            beginnerTeamCount: parseInt(countInfo.beginnerteamcount),
            advancedTeamCount: parseInt(countInfo.advancedteamcount),
            teamCount: parseInt(countInfo.teamcount),
        }));
}

// checks if any student ids in the given array are a member of a team in the given competition, returns true if any are
function isAnyStudentsInCompetition(competitionId, studentIds, waitlisted = false){
    return db.oneOrNone(`SELECT COUNT(*) FROM TeamsUsers WHERE TeamID IN (SELECT TeamID FROM Teams WHERE CompetitionID = $1) AND UserID IN ($2:csv) AND Waitlisted = $(waitlisted)`, [competitionId, studentIds, waitlisted]).then((result) => parseInt(result.count) > 0);
}

function getCompetitionId(teamId){
    return db.oneOrNone(`SELECT CompetitionID FROM Teams WHERE TeamID = $(teamId)`, {teamId}).then((result) => result.competitionid);
}

function getTeamInfo(teamId){
    return db.oneOrNone(`SELECT TeamID, SchoolID, CompetitionID, TeamName, SkillLevelID, AdvisorID, TeamStatusID FROM Teams WHERE TeamID = $(teamId)`, {teamId})
    .then((result) => {
        // only if the result is not null
        if(result){
            return {
                teamId: result.teamid,
                schoolId: result.schoolid,
                competitionId: result.competitionid,
                teamName: result.teamname,
                questionLevelId: result.questionlevelid,
                advisorId: result.advisorid,
                waitlisted: result.waitlisted,
            };
        }else{
            return null;
        }
    });
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
    getTeamInfo,
    getTeamsInCompetitionName,
    getAll,
    getAllSkillLevels,
    getWaitlistInfo,
    getAdvisorSchoolsTeams,
};
