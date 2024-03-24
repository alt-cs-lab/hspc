/*
List of Constants to be used throughout the project
*/

/*
Role Constants
*/
const VOLUNTEER = 20;
const JUDGE = 40;
const ADVISOR = 60;
const ADMIN = 80;
const MASTER = 100;
const legalLevels = [VOLUNTEER, JUDGE, ADVISOR, ADMIN, MASTER];

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
    toDatabaseDate
}