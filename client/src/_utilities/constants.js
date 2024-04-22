/*
List of Constants to be used throughout the project
*/

/**
 * Constants for month names
 */
const months = 
[
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
]

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

/**
 * Format Date From Database
 * EX: "2020-05-20"
 * @param {*} date 
 * @returns Reformatted Date
 */
const dateFormat = (date) => {
  return date.substring(0,10);
};

/**
 * Reformats the date to only include month and year
 * EX: "May 2020"
 * @param {*} date 
 * @returns Reformated Date
 */
const gradDateFormat = (date) => {
  date = date.substring(0,10)
  date = date.split('-')
  let month = months[(parseInt(date[1])-1)].label
  return month + ' ' + date[0];
};

/**
 * Reformates the date to only include month, day, and year
 * EX: "May 20, 2020"
 * @param {*} date 
 * @returns Reformatted Date
 */
const eventDateFormat = (date) => {
  date = date.substring(0, 10);
  date = date.split('-');
  let month = months[(parseInt(date[1]) - 1)].label;
  return month + ' ' + date[2] + ", " + date[0];
}

const phoneNumberFormat = (number) => {
  if (number.length === 10) {
    let areaCode = '(' + number[0] + number[1] + number[2] + ')';
    let specificNumber = ' ' + number[3] + number[4] + number[5] 
      + '-' + number[6] + number[7] + number[8] + number[9];
    return areaCode + specificNumber;
  }
  else { return number; }
}

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
    months,
    VOLUNTEER,
    JUDGE,
    ADVISOR,
    ADMIN,
    MASTER,
    legalLevels,
    toDatabaseDate,
    dateSort,
    dateFormat,
    gradDateFormat,
    eventDateFormat,
    timeFormat,
    phoneNumberFormat
}