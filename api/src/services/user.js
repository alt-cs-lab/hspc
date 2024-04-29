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
    //casRegister: casRegister,
    getLogin,
    getAllUsers,
    updateProfile
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

/*  THIS HAS BEEN POSTPONED UNTIL CAS SYSTEM IS SET UP AGAIN FOR STUDENT LOGIN AS VOLUNTEERS
function casRegister(firstName, lastName, email, accessLevel) {
    return db.none(`
        INSERT INTO Users (FirstName, LastName, Email, AccessLevel, RequestLevel)
        VALUES($(firstName), $(lastName), $(email), $(accessLevel), $(accessLevel))`,
        {firstName, lastName, email, accessLevel: constants.VOLUNTEER})
}*/

/**
 * Returns the login information for the user with the given email
 * @param {String} email
 * @returns
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