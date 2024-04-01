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
const STATUS_WAITLISTED = 1;
const STATUS_REGISTERED = 2;
const STATUS_DENIED = 3;
const STATUS_ARCHIVED = 4;
const teamStatuses = [STATUS_WAITLISTED, STATUS_REGISTERED, STATUS_DENIED, STATUS_ARCHIVED];


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
    STATUS_WAITLISTED,
    STATUS_REGISTERED,
    STATUS_DENIED,
    STATUS_ARCHIVED,
    teamStatuses,
    toDatabaseDate
}