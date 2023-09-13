const db = require("../utils/hspc_db").db;

module.exports = {
    addParticipant: addParticipant,
    getAllParticipants: getAllParticipants
};

function addParticipant(TeamName, SchoolName, StateCode, QuestionLevel, EventDate) {
    return db.none(`INSERT INTO Participants
                (TeamName, SchoolName, StateCode, QuestionLevel, EventDate)
            VALUES($(TeamName), $(SchoolName), $(StateCode), $(QuestionLevel), $(EventDate))`, 
            {TeamName, SchoolName, StateCode, QuestionLevel, EventDate});
}

function getAllParticipants(){
    return db.any(`SELECT 
                P.TeamName, P.SchoolName, P.StateCode, P.QuestionLevel, P.EventDate
                FROM Participants AS P`)
}