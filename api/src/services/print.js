/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

require('dotenv').config();

const db = require("../utils/hspc_db").db;
const constants = require("../utils/constants");
const { renameKeys } = require("../utils/extensions");
const bcrypt = require("bcrypt");

module.exports = {
    getEventTeams,
    getEventVolunteers
};

//Gets each student team associated with the provided Competition ID
function getEventTeams(competition){
    return db.any(`SELECT T.TeamName, 
                S.SchoolName, 
                HSS.FirstName,
                HSS.LastName,
                C.EventDate,
                C.EventDescription,
                C.EventTime,
                SL.SkillLevel
            FROM Teams AS T
                INNER JOIN Schools S ON S.SchoolID = T.SchoolID
                INNER JOIN HighSchoolStudents HSS ON HSS.SchoolID = S.SchoolID
                INNER JOIN Competitions C ON C.CompetitionID = T.CompetitionID
                INNER JOIN SkillLevels SL ON SL.SkillLevelID = T.SkillLevelID
            WHERE C.CompetitionID = $(competition)`, {
                competition
            }).then((teams) => renameKeys(teams, ['team','school','first', 'last', 'date', 'description', 'time', 'level']));
}

//Gets all volunteers associated with the provided Competition ID
function getEventVolunteers(competition){
    return db.any(`SELECT U.FirstName,
                U.LastName
            FROM Users AS U
                INNER JOIN Volunteers AS V on V.VolunteerID = U.UserID
                INNER JOIN Competitions AS C on C.CompetitionID = V.CompetitionID
            WHERE C.CompetitionID = $(competition)`, {
                competition
            }).then((volunteers) => renameKeys(volunteers, ['first', 'last']));
}