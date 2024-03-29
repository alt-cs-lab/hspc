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
* Formats a date compatable with the database
*/
function toDatabaseDate(year, month, day) {
    if (month > 9) return year + "-" + month + "-" + day;
    else return year + "-0" + month + "-" + day;
};

/*
* Sorting method for the date column
*/
const dateSort = (rowA, rowB) => {
    const a = Date.parse(rowA.date);
    const b = Date.parse(rowB.date);
    
    if (a > b) return 1;
    if (b > a) return -1;
    return 0;
  };

/*
* Format Date From Database
*/
const dateFormat = (date) => {
  return date.substring(0,10);
};

module.exports = {
    VOLUNTEER,
    JUDGE,
    ADVISOR,
    ADMIN,
    MASTER,
    legalLevels,
    toDatabaseDate,
    dateSort,
    dateFormat
}