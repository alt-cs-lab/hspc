/*
MIT License
Copyright (c) 2024 KSU-CS-Software-Engineering
*/

require("dotenv").config();

const db = require("../utils/hspc_db").db;
// const constants = require("../utils/constants");
// const { renameKeys } = require("../utils/extensions");
const bcrypt = require("bcrypt");
const { renameKeys } = require("../utils/extensions");

module.exports = {
    createStudent,
    getEmail,
    getStudents,
    getAdvisorSchoolsTeams,
}

function createStudent( { firstName, lastName, schoolId, email, gradDate } ) {
    console.log({ firstName, lastName, schoolId, email, gradDate });
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
        WHERE SA.UserID = $(advisorId)
    );`, {advisorId})
}