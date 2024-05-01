/**
 * Services for event functionality
 * Author:
 * Modified:
 */
const { renameKeys } = require("../utils/extensions");
const db = require("../utils/hspc_db").db;
const constants = require("../utils/constants");

module.exports = {
  createEvent,
  getPublished,
  getUnpublished,
  getEvent,
  getCompetitionTeamsInfo,
  getHighlightEvent,
};

/**
 * Creates a given event
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
  description,
}) {
  let eventStatus = constants.EVENT_STATUS_UNPUBLISHED;
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
            EventDescription,
            CompetitionStatusID) 
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
            $(description),
            $(eventStatus))`,
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
      description,
      eventStatus,
    }
  );
}

/**
 * Returns all published events
 */
function getPublished() {
  return db
    .any(
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
    )
    .then((events) =>
      renameKeys(events, [
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
        "status",
      ])
    );
}

/**
 * Returns all unpublished events
 */
function getUnpublished() {
  return db
    .any(
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
    )
    .then((events) =>
      renameKeys(events, [
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
        "status",
      ])
    );
}

/**
 * Returns an event based on its id
 */
function getEvent({ eventID }) {
  return db
    .oneOrNone(
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
    )
    .then((eventInfo) => ({
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
      status: eventInfo.Status,
    }));
}

/**
 * Returns the next competition (If none, most recent competition)
 */
function getHighlightEvent() {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = constants.toDatabaseDate(year, month, day);

  return db
    .any(
      `SELECT C.EventLocation, C.EventDate, C.EventStartTime, C.EventEndTime, C.EventName, C.EventDescription
        FROM Competitions AS C
        WHERE C.EventDate > $(currentDate)`,
      { currentDate }
    )
    .then((data) => {
      if (data[0] != null) {
        return db.any(
          `SELECT C.EventLocation, C.EventDate, C.EventStartTime, C.EventEndTime, C.EventName, C.EventDescription
                FROM Competitions AS C
                WHERE C.EventDate > $(currentDate)
                ORDER BY C.EventDate ASC
                LIMIT 1`,
          { currentDate }
        );
      } else {
        return db.any(
          `SELECT C.EventLocation, C.EventDate, C.EventStartTime, C.EventEndTime, C.EventName, C.EventDescription
                FROM Competitions AS C
                ORDER BY C.EventDate DESC
                LIMIT 1`
        );
      }
    });
}

/**
 * Returns team capacity information for a given competition
 */
function getCompetitionTeamsInfo(competitionID) {
  return db
    .oneOrNone(
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
    )
    .then((teamsInfo) => ({
      beginnerTeamsPerSchool: teamsInfo.beginnerteamsperschool,
      advancedTeamsPerSchool: teamsInfo.advancedteamsperschool,
      teamsPerSchool: teamsInfo.teamsperschool,
      beginnerTeamsPerEvent: teamsInfo.beginnerteamsperevent,
      advancedTeamsPerEvent: teamsInfo.advancedteamsperevent,
      teamsPerEvent: teamsInfo.teamsperevent,
    }));
}
