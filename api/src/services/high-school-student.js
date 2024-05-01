/**
 * Services for high school student functionality
 * Author:
 * Modified:
 */
require("dotenv").config();
const db = require("../utils/hspc_db").db;
const { renameKeys } = require("../utils/extensions");
const constants = require("../utils/constants.js");

module.exports = {
  createStudent,
  editStudent,
  getEmail,
  getAllStudents,
  getAdvisorSchoolsTeams,
  getStudentsInTeam,
  getStudentsWithNoTeam,
};

/**
 * Creates a given student
 */
function createStudent({ firstName, lastName, schoolId, email, gradDate }) {
  return db.none(
    `
        INSERT INTO HighSchoolStudents (FirstName, LastName, SchoolID, Email, GradDate)
        VALUES($(firstName), $(lastName), $(schoolId), $(email), $(gradDate))    
    `,
    {
      firstName,
      lastName,
      schoolId,
      email,
      gradDate,
    }
  );
}

/**
 * Updates a given student's details
 */
function editStudent({ studentId, firstName, lastName, schoolId, gradDate }) {
  return db.none(
    `
        UPDATE HighSchoolStudents 
        SET FirstName = $(firstName), LastName = $(lastName), SchoolID = $(schoolId), GradDate = $(gradDate)
        WHERE StudentID = $(studentId);
    `,
    { studentId, firstName, lastName, schoolId, gradDate }
  );
}

/**
 * Returns an email if it exists
 */
function getEmail(email) {
  return db
    .any(
      `
        SELECT HS.Email
        FROM HighSchoolStudents HS
        WHERE HS.Email = $(email)
    `,
      { email }
    )
    .then((data) => {
      data = renameKeys(data, ["email"]);
      return data.length > 0 ? data[0] : null;
    });
}

/**
 * Returns all students
 */
function getAllStudents() {
  return db.any(
    `
        SELECT HS.FirstName, HS.LastName, S.SchoolID, S.SchoolName, HS.Email, HS.GradDate
        FROM HighSchoolStudents HS
            INNER JOIN Schools S ON S.SchoolID = HS.SchoolID
    `
  );
}

/**
 * Returns all students associated with an advisor
 */
function getAdvisorSchoolsTeams(advisorId) {
  let approved = constants.ADVISOR_STATUS_APPROVED;
  return db.any(
    `
    SELECT HS.StudentID, HS.FirstName, HS.LastName, HS.SchoolID, HS.Email, HS.GradDate
	FROM HighSchoolStudents HS
    INNER JOIN Schools S on S.SchoolID = HS.SchoolID
	WHERE HS.SchoolID IN (
        SELECT S2.SchoolID
        FROM Schools S2
        INNER JOIN SchoolAdvisors SA on S2.SchoolId = SA.SchoolId
        WHERE SA.UserID = $(advisorId) AND SA.AdvisorStatusID = $(approved)
    );`,
    { advisorId, approved }
  );
}

/**
 * Returns students in a team
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

/**
 * Returns all students not in a team
 */
function getStudentsWithNoTeam(schoolId) {
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
    { schoolId }
  );
}
