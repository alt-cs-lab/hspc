/**
 * Services for team functionality
 */

const db = require("../utils/hspc_db").db;
// used for formating the data from the database to be more readable
const constants = require("../utils/constants");
const pgp = require("pg-promise")();

// every function is given an object as a parameter

//*************************************************************************************************************************************************************
// Code Added for curent end points required in the client
function getAllTeams(){
    return db.any(`
    SELECT T.TeamID, T.TeamName, T.CompetitionId, SK.SkillLevel, TS.Status, S.SchoolId, S.SchoolName, S.AddressLine1, S.AddressLine2, S.City, S."State", S.USDCode, U.Email 
    FROM 
        Teams T
        INNER JOIN SkillLevels SK ON T.SkillLevelID = SK.SkillLevelID
        INNER JOIN TeamStatus TS ON TS.StatusID = T.TeamStatusID
        INNER JOIN Schools S ON T.SchoolID = S.SchoolID  
        INNER JOIN Users U ON T.AdvisorID = U.UserID;`);
}

/**
 * Returns all skill levels
 */
function getAllSkillLevels() {
  return db.any("SELECT * FROM SkillLevels");
}

/**
 * Returns all schools for a given advisor
 */
function getAdvisorSchoolsTeams(advisorId) {
  let approved = constants.ADVISOR_STATUS_APPROVED;
  return db.any(
    `
    SELECT T.TeamId, T.SchoolID, T.CompetitionID, T.TeamName, SK.SkillLevel, TS.Status
	FROM Teams T
    INNER JOIN Schools S on S.SchoolID = T.SchoolID
    INNER JOIN SkillLevels SK on SK.SkillLevelID = T.SkillLevelID
    INNER JOIN TeamStatus TS on TS.StatusID = T.TeamStatusID
	WHERE T.SchoolID IN (
        SELECT S2.SchoolID
        FROM Schools S2
        INNER JOIN SchoolAdvisors SA on S2.SchoolId = SA.SchoolId
        WHERE SA.UserID = $(advisorId) AND SA.AdvisorStatusID = $(approved)
    );`,
    { advisorId, approved }
  );
}


// create creates a new team and adds any students in studentIds
function createTeam({ teamName, schoolId, competitionId, skillLevelId, advisorId, studentIds, waitlisted }) {
    // if waitlisted is not given, set it to false
    if (!waitlisted) {
        waitlisted = false;
    }
    // start a transaction
    return db.tx(async (t) => {
        // insert the team into the Teams table
        const result = await t.one(
            `INSERT INTO Teams (SchoolID, CompetitionID, TeamName, SkillLevelID, AdvisorID, TeamStatusID, TimeCreated) VALUES ($(schoolId), $(competitionId), $(teamName), $(skillLevelId), $(advisorId), 1, NOW()) RETURNING TeamID`,
            { schoolId, competitionId, teamName, skillLevelId, advisorId}
        );
        const teamId = result.teamid;

        // if teamId is undefined, throw an error
        if (!teamId) {
            throw new Error("Error: Team was not created.");
        }

    if (studentIds?.length > 0) {
      const values = studentIds.map((studentId) => ({
        StudentID: studentId,
        TeamID: teamId,
      }));

      const insertQuery = pgp.helpers.insert(
        values,
        ["StudentID", "TeamID"],
        "TeamMembers"
      );

      await t.none(insertQuery.toLowerCase());
    }

    return { teamId: teamId };
  });
}

/**
 * Returns the number of teams in a competition
 */
function teamsInCompetition({ competitionid, waitlisted = false }) {
  let statuses = [constants.TEAM_STATUS_REGISTERED];
  if (waitlisted) {
    statuses.push(constants.TEAM_STATUS_WAITLISTED);
  }
  return db.oneOrNone(
    `
            SELECT
                COUNT(*) as teamCount,
                SUM(CASE T.SkillLevelID when 1 then 1 else 0 end) as beginnerTeamCount,
                SUM(CASE T.SkillLevelID when 2 then 1 else 0 end) as advancedTeamCount
            FROM Teams T
            WHERE T.CompetitionID = $(competitionid) AND T.TeamStatusID = ANY($(statuses)) `,
    { competitionid, statuses }
  );
}

/**
 * Returns the number of teams a school has in a competition
 */
function teamsInCompetitionBySchool(
  competitionId,
  schoolId,
  waitlisted = false
) {
  let statuses = [constants.TEAM_STATUS_REGISTERED];
  if (waitlisted) {
    statuses.push(constants.TEAM_STATUS_WAITLISTED);
  }
  console.log(competitionId);
  console.log(schoolId);
  console.log(waitlisted);
  console.log(statuses);
  return db
    .oneOrNone(
      `
            SELECT
                COUNT(*) as teamCount,
                SUM(CASE T.SkillLevelID when 1 then 1 else 0 end) as beginnerTeamCount,
                SUM(CASE T.SkillLevelID when 2 then 1 else 0 end) as advancedTeamCount
            FROM Teams T
            WHERE T.CompetitionID = $(competitionId)
                AND T.SchoolID = $(schoolId)
                AND T.TeamStatusID = ANY($(statuses))`,
      { competitionId, schoolId, statuses }
    )
    .then((countInfo) => ({
      beginnerTeamCount: parseInt(countInfo.beginnerteamcount),
      advancedTeamCount: parseInt(countInfo.advancedteamcount),
      teamCount: parseInt(countInfo.teamcount),
    }));
}

/**
 * Returns the number of teams a school has in a competition
 */
function teamsInCompetitionForAllSchools({
  competitionid,
  waitlisted = false,
}) {
  let statuses = [constants.TEAM_STATUS_REGISTERED];
  if (waitlisted) {
    statuses.push(constants.TEAM_STATUS_WAITLISTED);
  }
  return db.any(
    `
            SELECT
                S.SchoolID,
                S.SchoolName,
                COUNT(*) as teamCount,
                SUM(CASE T.SkillLevelID when 1 then 1 else 0 end) as beginnerTeamCount,
                SUM(CASE T.SkillLevelID when 2 then 1 else 0 end) as advancedTeamCount
            FROM Teams T
                INNER JOIN Schools S ON S.SchoolID = T.SchoolID
            WHERE T.CompetitionID = $(competitionid)
                AND T.TeamStatusID = ANY($(statuses))
            GROUP BY S.SchoolID, S.SchoolName`,
    { competitionid, statuses }
  );
}

/**
 * Returns the details of a specific team
 */
function getTeamDetails({ teamid }) {
  return db.oneOrNone(
    `
            SELECT
                T.TeamID,
                T.TeamName,
                T.CompetitionID,
                SL.SkillLevel,
                S.SchoolName,
                T.TimeCreated,
                TS.Status,
                U.FirstName AS AdvisorFirstName,
                U.LastName AS AdvisorLastName,
                U.Email AS AdvisorEmail,
                U.Phone AS AdvisorPhone
            FROM Teams T
                INNER JOIN SkillLevels SL ON SL.SkillLevelID = T.SkillLevelID
                INNER JOIN Schools S ON S.SchoolID = T.SchoolID
                INNER JOIN TeamStatus TS ON TS.StatusID = T.TeamStatusID
                INNER JOIN Users U ON U.UserID = T.AdvisorID
            WHERE T.TeamID = $(teamid)`,
    { teamid }
  );
}

/**
 * Checks if any student ids in the given array are a member of a team in the given competition, returns true if any are
 */
function isAnyStudentsInCompetition(
  competitionId,
  studentIds,
  waitlisted = false
) {
  let statuses = [constants.TEAM_STATUS_REGISTERED];
  if (waitlisted) {
    statuses.push(constants.TEAM_STATUS_WAITLISTED);
  }

  return db
    .oneOrNone(
      `SELECT COUNT(*) FROM TeamMembers TM WHERE TeamID IN (SELECT TeamID FROM Teams WHERE CompetitionID = $(competitionId) AND T.TeamStatusID = ANY($(statuses))) 
    AND StudentID = ANY($(studentIds))`,
      [competitionId, studentIds, statuses]
    )
    .then((result) => parseInt(result.count) > 0);
}

module.exports = {
    createTeam,
    teamsInCompetition,
    teamsInCompetitionBySchool,
    teamsInCompetitionForAllSchools,
    isAnyStudentsInCompetition,
    getAllTeams,
    getAllSkillLevels,
    getAdvisorSchoolsTeams,
    getTeamDetails,
};
