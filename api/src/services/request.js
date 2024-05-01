/**
 * Services for request functionality
 */
require("dotenv").config();
const db = require("../utils/hspc_db").db;
const constants = require("../utils/constants.js");

module.exports = {
    getAllSchoolRequests,
    completeSchoolRequest,
    requestSchool,
    requestWaitlistedTeamsForEvent,
    completeTeamRegistration,
}

/**
 * Returns all pending requests for an advisor to be associated with a school
 */
function getAllSchoolRequests() {
    let pending = constants.ADVISOR_STATUS_PENDING
    return db.any(
        `
            SELECT SA.AdvisorID, SA.UserID, SA.SchoolID, U.FirstName, U.LastName, U.Phone, U.Email, S.SchoolName
            FROM SchoolAdvisors SA
                INNER JOIN Schools S ON S.SchoolID = SA.SchoolID
                INNER JOIN Users U ON U.UserID = SA.UserID
            WHERE SA.AdvisorStatusID = $(pending)
        `, { pending });
}

/**
 * Approves or denies a request for an advisor to be associated with a school
 */
function completeSchoolRequest( { approved, schoolid, advisorid }){
    if(approved){
        let statusApproved = constants.ADVISOR_STATUS_APPROVED
        return db.none(`
                UPDATE SchoolAdvisors SA
                SET AdvisorStatusID = $(statusApproved)
                WHERE SA.SchoolID = $(schoolid) AND SA.UserID = $(advisorid);
            `, { statusApproved, schoolid, advisorid } );
    }
    else{
        let statusDenied = constants.ADVISOR_STATUS_DENIED
        return db.none(`
                UPDATE SchoolAdvisors SA
                SET AdvisorStatusID = $(statusDenied)
                WHERE SA.SchoolID = $(schoolid) AND SA.UserID = $(advisorid);
            `, { statusDenied, schoolid, advisorid } );
    }
}

/**
 * Creates a request for an advisor to be associated with a school
 */
function requestSchool( { schoolid, advisorid } ) {
    let pending = constants.ADVISOR_STATUS_PENDING
    return db.none( `
        INSERT INTO SchoolAdvisors (UserID, SchoolID, AdvisorStatusID)
        VALUES($(advisorid), $(schoolid), $(pending))
    `,{ schoolid, advisorid, pending });
}

/**
 * Returns all waitlisted teams for a given competition
 */
function requestWaitlistedTeamsForEvent( { eventid } ) {
    let pending = constants.TEAM_STATUS_WAITLISTED
    return db.any(
        `
            SELECT T.TeamID, T.TeamName, T.SchoolID, S.SchoolName, SL.SkillLevel, T.TimeCreated 
            FROM Teams T 
                INNER JOIN Schools S ON S.SchoolID = T.SchoolID 
                INNER JOIN SkillLevels SL ON SL.SkillLevelID = T.SkillLevelID 
            WHERE T.CompetitionID = $(eventid) AND T.TeamStatusID = $(pending)
        `, { eventid, pending });
}

/**
 * Approves or denies a request for a team to be registered
 */
function completeTeamRegistration( { approved, teamid }){
    if(approved){
        let statusApproved = constants.TEAM_STATUS_REGISTERED
        return db.none(`
                UPDATE Teams T
                SET TeamStatusID = $(statusApproved)
                WHERE T.TeamID = $(teamid);
            `, { statusApproved, teamid } );
    }
    else{
        let statusDenied = constants.TEAM_STATUS_DENIED
        return db.none(`
                UPDATE Teams T
                SET TeamStatusID = $(statusDenied)
                WHERE T.TeamID = $(teamid);
            `, { statusDenied, teamid } );
    }
}