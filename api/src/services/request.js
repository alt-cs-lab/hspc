/*
MIT License
Copyright (c) 2024 KSU-CS-Software-Engineering
*/

require("dotenv").config();
const db = require("../utils/hspc_db").db;
const { renameKeys } = require("../utils/extensions");

module.exports = {
    getAllSchoolRequests,
    completeSchoolRequest,
    requestSchool,
    //createStudent,
    //getAdvisorSchoolsTeams,
    //getStudentsInTeam,
}

// function createStudent( { firstName, lastName, schoolId, email, gradDate } ) {
//     return db.none(
//     `
//         INSERT INTO HighSchoolStudents (FirstName, LastName, SchoolID, Email, GradDate)
//         VALUES($(firstName), $(lastName), $(schoolId), $(email), $(gradDate))    
//     `,
//     {
//         firstName, lastName, schoolId, email, gradDate
//     }
//     );
// }

function getAllSchoolRequests() {
    return db.any(
        `
            SELECT SA.AdvisorID, SA.UserID, SA.SchoolID, U.FirstName, U.LastName, U.Phone, U.Email, S.SchoolName
            FROM SchoolAdvisors SA
                INNER JOIN Schools S ON S.SchoolID = SA.SchoolID
                INNER JOIN Users U ON U.UserID = SA.UserID
            WHERE SA.Approved = false
        `);
}

function completeSchoolRequest( { approved, schoolid, advisorid }){
    if(approved){
        return db.none(`
                UPDATE SchoolAdvisors SA
                SET approved = true
                WHERE SA.SchoolID = $(schoolid) AND SA.UserID = $(advisorid);
            `, { schoolid, advisorid } );
    }
    else{
        // TODO TWP: Verify deletion below is alright
        return db.none(`
                DELETE FROM SchoolAdvisors
                WHERE SchoolID = $(schoolid) AND UserID = $(advisorid);
            `, { schoolid, advisorid } );
    }
}

function requestSchool( { schoolid, advisorid } ) {
    return db.none( `
        INSERT INTO SchoolAdvisors (UserID, SchoolID, Approved)
        VALUES($(advisorid), $(schoolid), false)
    `,{ schoolid, advisorid });
}

// function getAdvisorSchoolsTeams(advisorId) {
//     return db.any(`
//     SELECT HS.FirstName, HS.LastName, HS.SchoolID, HS.Email, HS.GradDate
// 	FROM HighSchoolStudents HS
//     INNER JOIN Schools S on S.SchoolID = HS.SchoolID
// 	WHERE HS.SchoolID IN (
//         SELECT S2.SchoolID
//         FROM Schools S2
//         INNER JOIN SchoolAdvisors SA on S2.SchoolId = SA.SchoolId
//         WHERE SA.UserID = $(advisorId) AND SA.Approved = true
//     );`, {advisorId})
// }

// /**
//  * Gets all the students based off their team name
//  * @param {string} teamName The name of the team
//  * @param {string} competitionid The id of the competition
//  * @returns All students of a certain team
//  */
// function getStudentsInTeam(competitionid, teamName) {
//     return db.any(
//       `
//           SELECT HS.StudentID, HS.FirstName, HS.LastName, HS.Email, HS.GradDate
//           FROM HighSchoolStudents HS
//               INNER JOIN TeamMembers TM ON TM.StudentID = HS.StudentID
//               INNER JOIN Teams T ON T.TeamID = TM.TeamID
//               INNER JOIN Competitions C ON T.CompetitionID = C.CompetitionID
//           WHERE T.TeamName = $(teamName) AND C.CompetitionID = $(competitionid)
//       `,
//       { teamName, competitionid }
//     );
// }