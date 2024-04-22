/*
MIT License
Copyright (c) 2024 KSU-CS-Software-Engineering
*/

require("dotenv").config();
const db = require("../utils/hspc_db").db;
const { renameKeys } = require("../utils/extensions");
const constants = require("../utils/constants.js");

module.exports = {
    createStudent,
    editStudent,
    editStudentEmail,
    getEmail,
    getAllStudents,
    getAdvisorSchoolsTeams,
    getStudentsInTeam,
    getStudentsWithNoTeam
}

function createStudent({ firstName, lastName, schoolId, email, gradDate }) {
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

function editStudent({ studentId, firstName, lastName, schoolId, gradDate }) {
    return db.none(
    `
        UPDATE HighSchoolStudents 
        SET FirstName = $(firstName), LastName = $(lastName), SchoolID = $(schoolId), GradDate = $(gradDate)
        WHERE StudentID = $(studentId);
    `,
        { studentId, firstName, lastName, schoolId, gradDate}
    );
}

function editStudentEmail({ studentId, email, firstName, lastName, schoolId, gradDate }) {
    return db.none(
        `
            UPDATE HighSchoolStudents 
            SET Email = $(email), FirstName = $(firstName), LastName = $(lastName), SchoolID = $(schoolId), GradDate = $(gradDate)
            WHERE StudentID = $(studentId);
        `,
            { studentId, email, firstName, lastName, schoolId, gradDate }
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

function getAllStudents() {
    return db.any(
    `
        SELECT HS.FirstName, HS.LastName, S.SchoolID, S.SchoolName, HS.Email, HS.GradDate
        FROM HighSchoolStudents HS
            INNER JOIN Schools S ON S.SchoolID = HS.SchoolID
    `);
}

// Trent Powell function to get all students for an advisor's schools
function getAdvisorSchoolsTeams(advisorId) {
    let approved = constants.ADVISOR_STATUS_APPROVED
    return db.any(`
    SELECT HS.StudentID, HS.FirstName, HS.LastName, HS.SchoolID, HS.Email, HS.GradDate
	FROM HighSchoolStudents HS
    INNER JOIN Schools S on S.SchoolID = HS.SchoolID
	WHERE HS.SchoolID IN (
        SELECT S2.SchoolID
        FROM Schools S2
        INNER JOIN SchoolAdvisors SA on S2.SchoolId = SA.SchoolId
        WHERE SA.UserID = $(advisorId) AND SA.AdvisorStatusID = $(approved)
    );`, {advisorId, approved})
}

/**
 * Gets all the students based off their team name
 * @param {string} teamName The name of the team
 * @param {string} competitionid The id of the competition
 * @returns All students of a certain team
 */
function getStudentsInTeam(teamid) {
    return db.any(
      `
          SELECT HS.StudentID, HS.FirstName, HS.LastName, HS.Email, HS.GradDate
          FROM HighSchoolStudents HS
              INNER JOIN TeamMembers TM ON TM.StudentID = HS.StudentID
              INNER JOIN Teams T ON T.TeamID = TM.TeamID
          WHERE T.TeamID = $(teamid)
      `,
      { teamid }
    );
}

function getStudentsWithNoTeam(schoolId){
    return db.any(
        `
            SELECT HS.StudentID, HS.FirstName, HS.LastName, HS.Email
            FROM HighSchoolStudents HS
                INNER JOIN Schools S ON S.SchoolID = HS.SchoolID
            WHERE HS.SchoolID = $(schoolId) 
                AND HS.GradDate > NOW()::DATE
                AND HS.StudentID NOT IN (
                    SELECT TM.StudentID
                    FROM TeamMembers TM
                        INNER JOIN Teams T ON T.TeamID = TM.TeamID
                    WHERE T.TeamStatusID != 5
                );
        `,
        {schoolId}
    );
}