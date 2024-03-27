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

/*
* Format Time From Database
*/
const timeFormat = (preformattedTime) => {
  preformattedTime = preformattedTime.split(':')
  var time = {
    hour: parseInt(preformattedTime[0]),
    minute: parseInt(preformattedTime[1]),
    string: ''
  }

  if(time.minute === 0) time.minute = '00';
  if(time.hour > 12) time.string = (time.hour%12) + ':' + time.minute + 'pm';
  else if (time.hour < 0) time.string = (time.hour + 12) + ':' + time.minute + 'pm';
  else if (time.hour === 0) time.string = (12) + ':' + time.minute + 'am';
  else if (time.hour === 12) time.string = (12) + ':' + time.minute + 'pm';
  else time.string = time.hour + ':' + time.minute + 'am';
  
  return time.string;
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
    dateFormat,
    timeFormat,
}