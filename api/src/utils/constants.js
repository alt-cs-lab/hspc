/*
List of Constants to be used throughout the project
*/

/*
Role Constants
*/
const VOLUNTEER = 2;
const JUDGE = 4;
const ADVISOR = 8;
const ADMIN = 16;
const MASTER = 32;
const legalLevels = [VOLUNTEER, JUDGE, ADVISOR, ADMIN, MASTER];

/*
Team Status Constants
*/
const TEAM_STATUS_WAITLISTED = 1;
const TEAM_STATUS_REGISTERED = 2;
const TEAM_STATUS_DENIED = 3;
const TEAM_STATUS_ARCHIVED = 4;
const teamStatuses = [TEAM_STATUS_WAITLISTED, TEAM_STATUS_REGISTERED, TEAM_STATUS_DENIED, TEAM_STATUS_ARCHIVED];

/*
Advisor Status Constants
*/
const ADVISOR_STATUS_PENDING = 1;
const ADVISOR_STATUS_APPROVED = 2;
const ADVISOR_STATUS_DENIED = 3;
const advisorStatuses = [ADVISOR_STATUS_PENDING, ADVISOR_STATUS_APPROVED, ADVISOR_STATUS_DENIED];


/**
 * Creates a date compatable with the database
 * @param {int} year
 * @param {int} month 
 * @param {int} day
 * @returns 
 */
function toDatabaseDate(year, month, day) {
    if (month > 9)
    {
        return year + "-" + month + "-" + day;
    }
    else
    {
        return year + "-0" + month + "-" + day;
    }
};

module.exports = {
    VOLUNTEER,
    JUDGE,
    ADVISOR,
    ADMIN,
    MASTER,
    legalLevels,
    TEAM_STATUS_WAITLISTED,
    TEAM_STATUS_REGISTERED,
    TEAM_STATUS_DENIED,
    TEAM_STATUS_ARCHIVED,
    teamStatuses,
    ADVISOR_STATUS_PENDING,
    ADVISOR_STATUS_APPROVED,
    ADVISOR_STATUS_DENIED,
    advisorStatuses,
    toDatabaseDate
}