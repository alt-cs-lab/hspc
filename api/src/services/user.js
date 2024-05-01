/**
 * Services for user functionality
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
    getStudents,
    advisorUpdateSchool,
    addstudent,
    checkinvolunteer,
    checkoutvolunteer,
    getactivevolunteers,
    updateProfile
};

/**
 * Returns a hash for a given password
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
 * Returns the current Date and Time
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
 */
function register({ firstName, lastName, email, phone, requestLevel, schoolId, password }) {
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
        let pending = constants.ADVISOR_STATUS_PENDING
        return db.none(
          `
                INSERT INTO SchoolAdvisors (UserID, SchoolID, AdvisorStatusID)
                VALUES((SELECT UserID FROM Users WHERE Email = $(email)), $(schoolId), $(pending))
            `,
          { email, schoolId, pending }
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
 */
function getLogin(email) {
  return db
    .any(
      `
        SELECT U.UserID, U.Email, U.EncryptedPassword, U.AccessLevel, U.FirstName, U.LastName, U.Phone
        FROM Users AS U
        WHERE U.Email = $(email)
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
        "phone",
      ]);
      return data.length > 0 ? data[0] : null;
    });
}

/**
 * Returns all users
 */
function getAllUsers() {
  return db.any(`
        SELECT U.UserID, U.FirstName, U.LastName, U.Email, U.Phone, R."Role"
        FROM Users AS U
            INNER JOIN Roles R ON R."Level" = U.AccessLevel
    `);
}

/**
 * Returns all volunteers
 */
function getAllVolunteers() {
  return db.any(`
        SELECT U.UserID, U.FirstName, U.LastName, U.Email, U.Phone
        FROM Users AS U
        WHERE U.AccessLevel = 20
    `);
}

/**
 * Returns all roles
 */
function getAllRoles() {
  return db.any(`
        SELECT * 
        FROM Roles
    `);
}

/**
 * Returns all students not on a team
 */
function getStudents(){
    return db.any(`
        SELECT HS.StudentID, HS.FirstName, HS.LastName, HS.SchoolID, HS.Email, HS.GradDate
        FROM HighSchoolStudents HS
        WHERE NOT EXISTS (SELECT StudentID FROM TeamMembers TM WHERE HS.StudentID = TM.StudentID)
    `);
}

/**
 * Changes an advisor's assigned school to the given school
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
 * Creates a student
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
}

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

/**
 * Updates a user based on their id and the given data
 */
function updateProfile( { updateData, userId } ) {
  var firstName = updateData.firstName;
  var lastName = updateData.lastName;
  var phone = updateData.phone;
  var email = updateData.email;
  return db.none(`
    UPDATE Users
    SET FirstName = $(firstName),
      LastName = $(lastName),
      Phone = $(phone),
      Email = $(email)
    WHERE UserID = $(userId)
  `, { userId, firstName, lastName, phone, email });
}