/*
MIT License
Copyright (c) 2024 KSU-CS-Software-Engineering
*/

require("dotenv").config();
const db = require("../utils/hspc_db").db;
const { renameKeys } = require("../utils/extensions");

module.exports = {
    createStudent,
    getEmail,
    getStudents,
    getAdvisorSchoolsTeams,
    getStudentsInTeam,
}

function createStudent( { firstName, lastName, schoolId, email, gradDate } ) {
    return db.none(
    `
        INSERT INTO HighSchoolStudents (FirstName, LastName, SchoolID, Email, GradDate)
        VALUES($(firstName), $(lastName), $(schoolId), $(email), $(gradDate))    
    `,
    {
        firstName, lastName, schoolId, email, gradDate
    }
    );
}

function getEmail(email) {
    return db.any(
    `
        SELECT HS.Email
        FROM HighSchoolStudents HS
        WHERE HS.Email = $(email)
    `, { email })
    .then((data) => {
      data = renameKeys(data, ["email"]);
      return data.length > 0 ? data[0] : null;
    });
}

function getStudents(schoolId) {
    return db.any(
    `
        SELECT HS.FirstName, HS.LastName, S.SchoolName, HS.Email, HS.GradDate
        FROM HighSchoolStudent HS
            INNER JOIN Schools S ON S.SchoolID = HS.SchoolID
            WHERE HS.SchoolID = $(schoolId)
    `, (schoolId));
}

// Trent Powell function to get all students for an advisor's schools
function getAdvisorSchoolsTeams(advisorId) {
    return db.any(`
    SELECT HS.FirstName, HS.LastName, HS.SchoolID, HS.Email, HS.GradDate
	FROM HighSchoolStudents HS
    INNER JOIN Schools S on S.SchoolID = HS.SchoolID
	WHERE HS.SchoolID IN (
        SELECT S2.SchoolID
        FROM Schools S2
        INNER JOIN SchoolAdvisors SA on S2.SchoolId = SA.SchoolId
        WHERE SA.UserID = $(advisorId) AND SA.Approved = true
    );`, {advisorId})
}

/**
 * Gets all the students based off their team name
 * @param {string} teamName The name of the team
 * @param {string} competitionid The id of the competition
 * @returns All students of a certain team
 */
function getStudentsInTeam(competitionid, teamName) {
    return db.any(
      `
          SELECT HS.StudentID, HS.FirstName, HS.LastName, HS.Email, HS.GradDate
          FROM HighSchoolStudents HS
              INNER JOIN TeamMembers TM ON TM.StudentID = HS.StudentID
              INNER JOIN Teams T ON T.TeamID = TM.TeamID
              INNER JOIN Competitions C ON T.CompetitionID = C.CompetitionID
          WHERE T.TeamName = $(teamName) AND C.CompetitionID = $(competitionid)
      `,
      { teamName, competitionid }
    );
  }