const { renameKeys } = require("../utils/extensions");

const db = require("../utils/hspc_db").db;
const constants = require('../utils/constants')

module.exports = {
    createEvent,
    getPublished,
    getUnpublished,
    getEvent,
    getCompetitionTeamsInfo,
    getHighlightEvent,
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
function createEvent({
    name,
    location,
    date,
    startTime,
    endTime,
    beginnerTeamsPerSchool,
    advancedTeamsPerSchool,
    teamsPerSchool,
    beginnerTeamsPerEvent,
    advancedTeamsPerEvent,
    teamsPerEvent,
    description}) {
    return db.none(
        `INSERT INTO Competitions(
            EventName,
            EventLocation,
            EventDate,
            EventStartTime,
            EventEndTime,
            BeginnerTeamsPerSchool,
            AdvancedTeamsPerSchool,
            TeamsPerSchool,
            BeginnerTeamsPerEvent,
            AdvancedTeamsPerEvent,
            TeamsPerEvent,
            EventDescription) 
        VALUES(
            $(name),
            $(location),
            $(date),
            $(startTime),
            $(endTime),
            $(beginnerTeamsPerSchool),
            $(advancedTeamsPerSchool),
            $(teamsPerSchool),
            $(beginnerTeamsPerEvent),
            $(advancedTeamsPerEvent),
            $(teamsPerEvent),
            $(description))`,
    {
        name,
        location,
        date,
        startTime,
        endTime,
        beginnerTeamsPerSchool,
        advancedTeamsPerSchool,
        teamsPerSchool,
        beginnerTeamsPerEvent,
        advancedTeamsPerEvent,
        teamsPerEvent,
        description}
    );
}

/*
 * Get all published events
 */
function getPublished() {
    return db.any(
        `SELECT
            C.CompetitionID,
            C.EventName,
            C.EventLocation,
            C.EventDate,
            C.EventStartTime, 
            C.EventEndTime, 
            C.EventDescription,
            C.BeginnerTeamsPerSchool,
            C.AdvancedTeamsPerSchool,
            C.TeamsPerSchool,
            C.BeginnerTeamsPerEvent,
            C.AdvancedTeamsPerEvent,
            C.TeamsPerEvent,
            CS.Status
        FROM Competitions AS C
        LEFT JOIN CompetitionStatus AS CS
            ON C.CompetitionStatusID = CS.StatusID
        WHERE CS.Status <> 'Unpublished'`
    ).then((events) => renameKeys(events,[
        "id",
        "name",
        "location",
        "date",
        "startTime",
        "endTime",
        "description",
        "beginnerTeamsPerSchool",
        "advancedTeamsPerSchool",
        "teamsPerSchool",
        "beginnerTeamsPerEvent",
        "advancedTeamsPerEvent",
        "teamsPerEvent",
        "status"
    ]));
}

/*
 * Get all unpublished events
 */
function getUnpublished() {
    return db.any(
        `SELECT
            C.CompetitionID,
            C.EventName,
            C.EventLocation,
            C.EventDate,
            C.EventStartTime, 
            C.EventEndTime, 
            C.EventDescription,
            C.BeginnerTeamsPerSchool,
            C.AdvancedTeamsPerSchool,
            C.TeamsPerSchool,
            C.BeginnerTeamsPerEvent,
            C.AdvancedTeamsPerEvent,
            C.TeamsPerEvent,
            CS.Status
        FROM Competitions AS C
        LEFT JOIN CompetitionStatus AS CS
            ON C.CompetitionStatusID = CS.StatusID
        WHERE CS.Status = 'Unpublished'`
    ).then((events) => renameKeys(events,[
        "id",
        "name",
        "location",
        "date",
        "startTime",
        "endTime",
        "description",
        "beginnerTeamsPerSchool",
        "advancedTeamsPerSchool",
        "teamsPerSchool",
        "beginnerTeamsPerEvent",
        "advancedTeamsPerEvent",
        "teamsPerEvent",
        "status"
    ]));
}

/*
 * Get an event
 */
function getEvent( {eventID} ) {
    return db.oneOrNone(
        `SELECT
            C.CompetitionID,
            C.EventName,
            C.EventLocation,
            C.EventDate,
            C.EventStartTime, 
            C.EventEndTime, 
            C.EventDescription,
            C.BeginnerTeamsPerSchool,
            C.AdvancedTeamsPerSchool,
            C.TeamsPerSchool,
            C.BeginnerTeamsPerEvent,
            C.AdvancedTeamsPerEvent,
            C.TeamsPerEvent,
            CS.Status
        FROM Competitions AS C
        LEFT JOIN CompetitionStatus AS CS
            ON C.CompetitionStatusID = CS.StatusID
        WHERE C.CompetitionID = $(eventID);`,
        { eventID }
    ).then((eventInfo) => ({
        competitionID: eventInfo.CompetitionID,
        eventName: eventInfo.EventName,
        eventLocation: eventInfo.EventLocation,
        eventDate: eventInfo.EventDate,
        eventStartTime: eventInfo.EventStartTime,
        eventEndTime: eventInfo.EventEndTime,
        eventDescription: eventInfo.EventDescription,
        beginnerTeamsPerSchool: eventInfo.BeginnerTeamsPerSchool,
        advancedTeamsPerSchool: eventInfo.AdvancedTeamsPerSchool,
        teamsPerSchool: eventInfo.TeamsPerSchool,
        beginnerTeamsPerEvent: eventInfo.BeginnerTeamsPerEvent,
        advancedTeamsPerEvent: eventInfo.AdvancedTeamsPerEvent,
        teamsPerEvent: eventInfo.TeamsPerEvent,
        status: eventInfo.Status
    }));
}

/*
 * Function to get "Highlight" Compeitition which means next upcoming or if there is none then the most recent.
 */
function getHighlightEvent() {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = constants.toDatabaseDate(year, month, day);

    return db.any(
        `SELECT C.EventLocation, C.EventDate, C.EventStartTime, C.EventEndTime, C.EventName, C.EventDescription
        FROM Competitions AS C
        WHERE C.EventDate > $(currentDate)`, {currentDate})
    .then((data)=>{
        if (data[0] != null) {
            return db.any(
                `SELECT C.EventLocation, C.EventDate, C.EventStartTime, C.EventEndTime, C.EventName, C.EventDescription
                FROM Competitions AS C
                WHERE C.EventDate > $(currentDate)
                ORDER BY C.EventDate ASC
                LIMIT 1`, {currentDate})
        }
        else{
            return db.any(
                `SELECT C.EventLocation, C.EventDate, C.EventStartTime, C.EventEndTime, C.EventName, C.EventDescription
                FROM Competitions AS C
                ORDER BY C.EventDate DESC
                LIMIT 1`)
        }
    })
}

// returns the TeamsPerSchool and TeamsPerEvent for a given competition
function getCompetitionTeamsInfo(competitionID) {
    return db.oneOrNone(
        `SELECT 
            BeginnerTeamsPerSchool,
            AdvancedTeamsPerSchool,
            TeamsPerSchool,
            BeginnerTeamsPerEvent,
            AdvancedTeamsPerEvent,
            TeamsPerEvent
        FROM Competitions
        WHERE CompetitionID = $(competitionID);`,
        { competitionID }
    ).then((teamsInfo) => ({
        beginnerTeamsPerSchool: teamsInfo.beginnerteamsperschool,
        advancedTeamsPerSchool: teamsInfo.advancedteamsperschool,
        teamsPerSchool: teamsInfo.teamsperschool,
        beginnerTeamsPerEvent: teamsInfo.beginnerteamsperevent,
        advancedTeamsPerEvent: teamsInfo.advancedteamsperevent,
        teamsPerEvent: teamsInfo.teamsperevent,
    }));
}
