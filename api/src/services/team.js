/**
 * Services for team functionality
 */

const db = require("../utils/hspc_db").db;
const { renameKeys } = require("../utils/extensions");
const constants = require("../utils/constants");
const { Int } = require("mssql");
const { getCompetitionTeamsInfo } = require("./event");
const pgp = require("pg-promise")();

/**
 * Returns all teams
 */
function getAll() {
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
 * Returns all teams in a given competition
 */
function getTeamsInCompetitionName(eventName) {
  return db.any(
    `
    SELECT T.TeamID, T.TeamName, SK.SkillLevel, S.SchoolName, S.AddressLine1, S.AddressLine2, S.City, S."State", S.USDCode, U.Email 
    FROM 
        Teams T
        INNER JOIN Questions Q ON T.SkillLevelID = Q.SkillLevelID
        INNER JOIN SkillLevels SK ON Q.SkillevelID = SK.SkillLevelID
        INNER JOIN School S ON T.SchoolID = S.SchoolID  
        INNER JOIN Users U ON T.AdvisorID = U.UserID
        INNER JOIN Competition C ON T.CompetitionID = C.CompetitionID
    WHERE C.EventName = $(eventName);`,
    { eventName }
  );
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

/**
 * Gets waitlist info for a given school
 */
function getWaitlistInfo({ schoolId }) {
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
      const waitlistInfo = {
        beginnerWaitlist: false,
        advancedWaitlist: false,
      };

      if (competitionTeamsInfo.teamsPerEvent <= teamsInCompetition.teamCount) {
        waitlistInfo.beginnerWaitlist = true;
        waitlistInfo.advancedWaitlist = true;
      }

      waitlistInfo.beginnerWaitlist |=
        competitionTeamsInfo.beginnerTeamsPerSchool <=
          teamsInCompetitionBySchool.beginnerTeamCount ||
        competitionTeamsInfo.beginnerTeamsPerEvent <=
          teamsInCompetition.beginnerTeamCount;

      waitlistInfo.advancedWaitlist |=
        competitionTeamsInfo.advancedTeamsPerSchool <=
          teamsInCompetitionBySchool.advancedTeamCount ||
        competitionTeamsInfo.advancedTeamsPerEvent <=
          teamsInCompetition.advancedTeamCount;

      return waitlistInfo;
    }
  );
}

/**
 * Returns a list of teams, filtering on any present parameters
 */
function get({
  schoolId,
  competitionId,
  questionLevelId,
  advisorId,
  teamId,
  waitlisted,
}) {
  return db.tx(async (t) => {
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
    let query = `SELECT T.TeamID, T.SchoolID, T.CompetitionID, T.TeamName, T.QuestionLevelID, T.AdvisorID, T.Waitlisted, T.TimeCreated FROM Teams T`;
    if (whereList.length > 0) {
      query += ` WHERE ${whereList.join(" AND ")}`;
    }
    const teams = await t.any(query, values);
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

    if (teamId && response?.length > 0) {
      const rawUserIds = await t.any(
        `SELECT UserID FROM TeamsUsers WHERE TeamID = $(teamId)`,
        { teamId }
      );
      if (rawUserIds?.length > 0) {
        const userIds = rawUserIds.map((obj) => obj.userid);
        const users = await t.any(
          `SELECT UserID, FirstName, LastName, Email FROM Users WHERE UserID = ANY($1)`,
          [userIds]
        );
        response[0].members = renameKeys(users, [
          "userId",
          "firstName",
          "lastName",
          "email",
        ]);
      }
    }

    return response;
  });
}

/**
 * creates a new team and assigns given student ids to it
 */
function create({
  teamName,
  schoolId,
  competitionId,
  skillLevelId,
  advisorId,
  studentIds,
  waitlisted,
}) {
  if (!waitlisted) {
    waitlisted = false;
  }
  return db.tx(async (t) => {
    const result = await t.one(
      `INSERT INTO Teams (SchoolID, CompetitionID, TeamName, SkillLevelID, AdvisorID, TeamStatusID, TimeCreated) VALUES ($(schoolId), $(competitionId), $(teamName), $(skillLevelId), $(advisorId), 1, NOW()) RETURNING TeamID`,
      { schoolId, competitionId, teamName, skillLevelId, advisorId }
    );
    const teamId = result.teamid;

    if (!teamId) {
      throw new Error("Team was not created");
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
 * Updates a team and assigns given student ids to it
 */
function update({ teamId, studentIds, teamName, questionLevelId, waitlisted }) {
  return db.tx(async (t) => {
    if (studentIds?.length > 0) {
      const insertValues = studentIds.map((studentId) => ({
        UserID: studentId,
        TeamID: teamId,
      }));
      const query = pgp.helpers.insert(
        insertValues,
        ["UserID", "TeamID"],
        "TeamsUsers"
      );
      await t.none(query.toLowerCase());
    }
    if (waitlisted !== undefined) {
      await t.none(
        `UPDATE Teams SET TeamStatusID = $(waitlisted) WHERE TeamID = $(teamId)`,
        {
          waitlisted,
          teamId,
        }
      );
    }

    if (questionLevelId) {
      await t.none(
        `UPDATE Teams SET SkillLevelID = $(questionLevelId) WHERE TeamID = $(teamId)`,
        {
          questionLevelId,
          teamId,
        }
      );
    }
    if (teamName) {
      await t.none(
        `UPDATE Teams SET TeamName = $(teamName) WHERE TeamID = $(teamId)`,
        { teamName, teamId }
      );
    }
  });
}

/**
 * Removes a team and all of its students or just a student if studentId is given'
 */
function remove({ teamId, studentId }) {
  return db.tx(async (t) => {
    if (studentId) {
      await t.none(
        `DELETE FROM TeamsUsers WHERE TeamID = $(teamId) AND UserID = $(studentId)`,
        {
          teamId,
          studentId,
        }
      );
    } else {
      await t.none(`DELETE FROM TeamsUsers WHERE TeamID = $(teamId)`, {
        teamId,
      });
      await t.none(`DELETE FROM Teams WHERE TeamID = $(teamId)`, { teamId });
    }
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

/**
 * Returns the competition id associated with a given team
 */
function getCompetitionId(teamId) {
  return db
    .oneOrNone(`SELECT CompetitionID FROM Teams WHERE TeamID = $(teamId)`, {
      teamId,
    })
    .then((result) => result.competitionid);
}

/**
 * Returns information about a given team
 */
function getTeamInfo(teamId) {
  return db
    .oneOrNone(
      `SELECT TeamID, SchoolID, CompetitionID, TeamName, SkillLevelID, AdvisorID, TeamStatusID FROM Teams WHERE TeamID = $(teamId)`,
      { teamId }
    )
    .then((result) => {
      if (result) {
        return {
          teamId: result.teamid,
          schoolId: result.schoolid,
          competitionId: result.competitionid,
          teamName: result.teamname,
          questionLevelId: result.questionlevelid,
          advisorId: result.advisorid,
          waitlisted: result.waitlisted,
        };
      } else {
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
  teamsInCompetitionForAllSchools,
  isAnyStudentsInCompetition,
  getCompetitionId,
  getTeamInfo,
  getTeamsInCompetitionName,
  getAll,
  getAllSkillLevels,
  getWaitlistInfo,
  getAdvisorSchoolsTeams,
  getTeamDetails,
};
