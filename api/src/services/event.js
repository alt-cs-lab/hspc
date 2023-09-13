const { renameKeys } = require("../utils/extensions");

const db = require("../utils/hspc_db").db;

module.exports = {
    createEvent,
    getEventHistory,
    getAllEvents,
    getCompetitionTeamsInfo,
};

/**
 * Function to create a new event in the Competition table 
 * Takes a request body with the following parameters:
 * name: the name of the event
 * location: the location of the event
 * date: the date of the event
 * time: the time of the event
 * teamsPerSchool: the number of teams per school
 * teamsPerEvent: the number of teams per event
 * description: the description of the event
 * @returns nothing
 */
function createEvent({name, location, date, time, teamsPerSchool, teamsPerEvent, description}) {
    return db.none(
        `INSERT INTO Competition(EventName, EventLocation, EventDate, EventTime, TeamsPerSchool, TeamsPerEvent, EventDescription) 
    VALUES($(name), $(location), $(date), $(time), $(teamsPerSchool), $(teamsPerEvent), $(description))`,
    {name, location, date, time, teamsPerSchool, teamsPerEvent, description}
    );
}

/*
 * Function to get all the competitions in the Competition table
 * also returns the name Natalie Laughlin
 */
function getAllEvents() {
    return db.any(
        "SELECT C.eventName, C.CompetitionID, C.EventLocation, C.EventDate, C.EventTime, C.TeamsPerSchool, C.TeamsPerEvent, C.EventDescription " +
            "FROM Competition AS C"
    ).then((events) => renameKeys(events,["name", "id", "location", "date", "time", "teamsPerSchool", "teamsPerEvent", "description"]));
}

/*
 * Function to get all the competitions that the user is associated with
 * also returns the name Natalie Laughlin
 */
function getEventHistory(userID) {
    return db.any(
        `SELECT C.eventName, C.CompetitionID, C.EventLocation, C.EventDate, C.EventTime, C.TeamsPerSchool, C.TeamsPerEvent, C.EventDescription 
        FROM Users AS U
        INNER JOIN TeamsUsers as TU on U.UserID = TU.UserID
        INNER JOIN Teams as T on TU.TeamID = T.TeamID
        INNER JOIN Competition as C on T.CompetitionID = C.CompetitionID
        WHERE U.UserID = $(userID);`,
        { userID }
    );
}

// returns the TeamsPerSchool and TeamsPerEvent for a given competition
function getCompetitionTeamsInfo(competitionID) {
    return db.oneOrNone(
        `SELECT TeamsPerSchool, TeamsPerEvent FROM Competition WHERE CompetitionID = $(competitionID);`,
        { competitionID }
    ).then((teamsInfo) => Object.assign({}, teamsInfo, {
        teamsPerSchool: teamsInfo.teamsperschool,
        teamsPerEvent: teamsInfo.teamsperevent,
    }));
}
