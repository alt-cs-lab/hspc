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
                U.FirstName,
                U.LastName,
                C.EventDate,
                C.EventDescription,
                C.EventTime,
                Q.QuestionLevel
            FROM Teams AS T
                INNER JOIN TeamsUsers AS E on E.TeamID = T.TeamID
                INNER JOIN Users AS U on U.UserID = A.UserID
                INNER JOIN School AS S on S.SchoolID = T.SchoolID
                INNER JOIN AdvisorAffiliation AS A on A.School = S.SchoolID
                INNER JOIN Competition AS C on C.CompetitionID = T.CompetitionID
                INNER JOIN QuestionLevel AS Q on Q.QuestionLevelID = T.QuestionLevelID
            WHERE C.CompetitionID = $(competition)`, {
                competition
            }).then((teams) => renameKeys(teams, ['team','school','first', 'last', 'date', 'description', 'time', 'level']));
}

//Gets all volunteers associated with the provided Competition ID
function getEventVolunteers(competition){
    return db.any(`SELECT U.FirstName,
                U.LastName
            FROM Users AS U
                INNER JOIN VolunteerAssignment AS V on V.VolunteerID = U.UserID
                INNER JOIN Competition AS C on C.CompetitionID = V.CompetitionID
            WHERE C.CompetitionID = $(competition)`, {
                competition
            }).then((volunteers) => renameKeys(volunteers, ['first', 'last']));
}