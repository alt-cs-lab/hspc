/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

require("dotenv").config();

const db = require("../utils/hspc_db").db;
const constants = require("../utils/constants");
const { renameKeys } = require("../utils/extensions");
const bcrypt = require("bcrypt");

module.exports = {
    register,
    casRegister: casRegister,
    getLogin,
    getAllUsers,
    getAllRoles,
    getAllVolunteers,
    getAdvisors,
    getStudents,
    advisorUpdateSchool,
    addstudent,
    getStudentsFromAdvisors,
    getstudentsteam,
    checkinvolunteer,
    checkoutvolunteer,
    getactivevolunteers,
};

/**
 * Generates a hash for a password
 * @param {string} password The given password
 * @returns A new hash
 */
function generateHash(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  });
}

/**
 * Gets the current Date and Time
 * @returns A string consisting of the date and time
 */
function getDateTime() {
  var currentDate = new Date();
  return (
    currentDate.getFullYear() +
    "-" +
    (currentDate.getMonth() + 1) +
    "-" +
    currentDate.getDate() +
    " " +
    currentDate.getHours() +
    ":" +
    currentDate.getMinutes() +
    ":" +
    currentDate.getSeconds()
  );
}

/**
 * Registers a new user
 * @param {List?} list A list of all the items needed to make a new user
 * @returns Nothing
 */
function register({ firstName, lastName, email, phone, requestLevel, schoolId, password }) {
    // newly registered users are either volunteer or advisor accounts
    // otherwise they must be upgraded by an admin
    // TODO TWP: Access Level should not implicitly equal request level.
    accessLevel = requestLevel;
    return generateHash(password).then((encryptedPassword) => 
    {
        var dateTime = getDateTime();
        return db.none(`
            INSERT INTO Users (FirstName, LastName, Email, Phone, AccessLevel, RequestLevel, EncryptedPassword, CreatedOn, AccessedOn)
            VALUES($(firstName), $(lastName), $(email), $(phone), $(accessLevel), $(requestLevel), $(encryptedPassword), $(dateTime), $(dateTime))
        `,
        {
          firstName,
          lastName,
          email,
          phone,
          accessLevel,
          requestLevel,
          encryptedPassword,
          dateTime,
        }
      );
    })
    .then(() => {
      if (requestLevel == constants.ADVISOR) {
        // if they are registering as an advisor, we need to add an AdvisorsAffiliation record
        return db.none(
          `
                INSERT INTO SchoolAdvisors (UserID, SchoolID)
                VALUES((SELECT UserID FROM Users WHERE Email = $(email)), $(schoolId))
            `,
          { email, schoolId }
        );
      }
    });
}

function casRegister(firstName, lastName, email, accessLevel) {
    /* TODO DEG: Not being used 2/7/24
    return db.none(`
        INSERT INTO Users (FirstName, LastName, Email, AccessLevel, RequestLevel)
        VALUES($(firstName), $(lastName), $(email), $(accessLevel), $(accessLevel))`,
        {firstName, lastName, email, accessLevel: constants.VOLUNTEER})
    */
}

/**
 * Returns the login information for the user with the given email
 * @param {String} email
 * @returns
 */
function getLogin(email) {
  return db
    .any(
      `
        SELECT U.UserID, U.Email, U.EncryptedPassword, U.AccessLevel, U.FirstName, U.LastName
        FROM Users AS U
        WHERE Email = $(email)
    `,
      { email }
    )
    .then((data) => {
      data = renameKeys(data, [
        "id",
        "email",
        "encryptedPassword",
        "accessLevel",
        "firstName",
        "lastName",
      ]);
      return data.length > 0 ? data[0] : null;
    });
}

/**
 * Gets all the users from the database
 * @returns All the users from the database
 */
function getAllUsers() {
  return db.any(`
        SELECT U.UserID, U.FirstName, U.LastName, U.Email, U.Phone, R."Role"
        FROM Users AS U
            INNER JOIN Roles R ON R."Level" = U.AccessLevel
    `);
}

/**
 * Gets all the volunteers from the database
 * @returns All the volunteers
 */
function getAllVolunteers() {
  return db.any(`
        SELECT U.UserID, U.FirstName, U.LastName, U.Email, U.Phone
        FROM Users AS U
        WHERE U.AccessLevel = 20
    `);
}

/**
 * Gets all the roles from the Roles table
 * @returns All the roles
 */
function getAllRoles() {
  return db.any(`
        SELECT * 
        FROM Roles
    `);
}

/**
 * Gets all the advisors
 * @returns All the Advisors
 */
function getAdvisors() {
  return db.any(`
        SELECT U.UserID, U.FirstName, U.LastName, U.Email, U.Phone, S.SchoolName
        FROM Users U
            INNER JOIN SchoolAdvisors SA ON SA.UserID = U.UserID
            INNER JOIN Schools S ON S.SchoolID = SA.SchoolID
    `);
}

/**
 * Gets students who are not on a team
 * @returns All the students not on a team
 */
function getStudents(){
    return db.any(`
        SELECT HS.StudentID, HS.FirstName, HS.LastName, HS.SchoolID, HS.Email, HS.GradDate
        FROM HighSchoolStudents HS
        WHERE NOT EXISTS (SELECT StudentID FROM TeamMembers TM WHERE HS.StudentID = TM.StudentID)
    `);
}

/**
 * Changes the school an advisor is attached to
 * @param {int} userId The id of the advisor
 * @param {int} schoolId The id of the school
 * @returns Nothing
 */
function advisorUpdateSchool(userId, schoolId) {
  return db.none(
    `
        UPDATE SchoolAdvisors 
        SET SchoolID = $(schoolId) 
        WHERE UserID = $(userId)
    `,
    { userId, schoolId }
  );
}

/**
 * Gets all the students for an advisor
 * @param {string} email The email of the advisor
 * @returns All the students for an advisor
 */
function getStudentsFromAdvisors(email){
    return db.any(`
        SELECT HS.StudentID, HS.FirstName, HS.LastName, HS.SchoolID, HS.Email, HS.GradDate
        FROM HighSchoolStudents HS
            INNER JOIN Schools S ON S.SchoolID = HS.SchoolID
            INNER JOIN SchoolAdvisors SA ON SA.SchoolID = S.SchoolID
                WHERE SA.UserID IN (SELECT U.UserID FROM Users U WHERE U.Email = $(email))
    `,
    { email }
  );
}

/**
 * Adds a student to the Users and HighSchoolStudents table
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} email
 * @param {string} phone
 * @param {short} accessLevel
 * @param {short} requestLevel
 * @param {string} encryptedPassword
 * @param {int} schoolID
 * @returns Nothing
 */
function addstudent(
  firstName,
  lastName,
  email,
  phone,
  accessLevel,
  requestLevel,
  encryptedPassword,
  schoolId
) {
  var dateTime = getDateTime();
  return db.none(
    `
        INSERT INTO Users (FirstName, LastName, Email, Phone, AccessLevel, RequestLevel, EncryptedPassword, CreatedOn, AccessedOn)
        VALUES($(firstName), $(lastName), $(email), $(phone), $(accessLevel), $(requestLevel), $(encryptedPassword), $(dateTime), $(dateTime))

        INSERT INTO HighSchoolStudents (FirstName, LastName, SchoolID, Email, GradDate)
        VALUES($(firstName), $(lastName), $(schoolId), $(email), $(gradDate)) 
    `,
    {
      firstName,
      lastName,
      email,
      phone,
      accessLevel,
      requestLevel,
      encryptedPassword,
      schoolId,
      dateTime,
    }
  );

//    return db.none(`INSERT INTO Users (FirstName, LastName, Email, Phone, AccessLevel, RequestLevel, EncryptedPassword) VALUES($(firstName), $(lastName), $(email), $(phone), $(accessLevel), $(requestLevel), $(encryptedPassword)); 
//    insert into student values((select userid from users where email= $(email)),(select userid from users where email=$(advisoremail)));`, {firstName, lastName, email, phone, accessLevel, requestLevel, encryptedPassword, advisoremail});
}

/**
 * Gets all the students based off their team name
 * @param {string} teamName The name of the team
 * @returns All students of a certain team
 */
function getstudentsteam(teamName) {
  return db.any(
    `
        SELECT HS.StudentID, HS.FirstName, HS.LastName, HS.Email, HS.SchoolID
        FROM HighSchoolStudents HS
            INNER JOIN TeamMembers TM ON TM.StudentID = HS.StudentID
            INNER JOIN Teams T ON T.TeamID = TM.TeamID
                WHERE T.TeamName = $(teamName)
    `,
    { teamName }
  );

  // return db.any(`select Users.Phone, Users.Firstname, Users.LastName, Users.email, Users.AccessLevel  From users inner join teamsusers on teamsUsers.userid = users.userid inner join Teams on teams.teamid = teamsusers.teamid where teams.teamname = $(teamName);`, {teamName})
}


//Function used to check in Volunteers based on userid
function checkinvolunteer(userid) {
  /* TODO TWP: Not being used 2/5/2024
    return db.none(`UPDATE Users SET Active = 1 WHERE userId = $(userid)`, {userid})
    */
}

//Function used to remove volunteer from being checked in
function checkoutvolunteer(userid) {
  /* TODO TWP: Not being used 2/5/2024
    return db.none(`UPDATE Users SET Active = 0 WHERE userId = $(userid)`, userid)
    */
}

//Function used to return all volunteers set as checked in
function getactivevolunteers() {
  /* TODO TWP: Not being used 2/5/2024
    return db.any(
    `SELECT U.UserID, U.FirstName, U.LastName, U.Email
    FROM Users AS U
    WHERE U.AccessLevel = 20 AND U.Active = 1`)*/
}
