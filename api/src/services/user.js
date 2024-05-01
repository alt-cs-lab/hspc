/**
 * Services for user functionality
 * Author:
 * Modified: 5/1/2024
 */
require("dotenv").config();

const db = require("../utils/hspc_db").db;
const constants = require("../utils/constants");
const { renameKeys } = require("../utils/extensions");
const bcrypt = require("bcrypt");

module.exports = {
  register,
  getLogin,
  getAllUsers,
  updateProfile,
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
function register({
  firstName,
  lastName,
  email,
  phone,
  requestLevel,
  schoolId,
  password,
}) {
  // newly registered users are either volunteer or advisor accounts
  // otherwise they must be upgraded by an admin
  accessLevel = requestLevel;
  return generateHash(password)
    .then((encryptedPassword) => {
      var dateTime = getDateTime();
      return db.none(
        `
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
        let pending = constants.ADVISOR_STATUS_PENDING;
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

/*  THIS HAS BEEN POSTPONED UNTIL CAS SYSTEM IS SET UP AGAIN FOR STUDENT LOGIN AS VOLUNTEERS
function casRegister(firstName, lastName, email, accessLevel) {
    return db.none(`
        INSERT INTO Users (FirstName, LastName, Email, AccessLevel, RequestLevel)
        VALUES($(firstName), $(lastName), $(email), $(accessLevel), $(accessLevel))`,
        {firstName, lastName, email, accessLevel: constants.VOLUNTEER})
}*/

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
 * Updates a user based on their id and the given data
 */
function updateProfile({ updateData, userId }) {
  var firstName = updateData.firstName;
  var lastName = updateData.lastName;
  var phone = updateData.phone;
  var email = updateData.email;
  return db.none(
    `
    UPDATE Users
    SET FirstName = $(firstName),
      LastName = $(lastName),
      Phone = $(phone),
      Email = $(email)
    WHERE UserID = $(userId)
  `,
    { userId, firstName, lastName, phone, email }
  );
}
