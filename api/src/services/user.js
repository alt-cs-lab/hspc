/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

require('dotenv').config();

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
    getAdvisorSchool,
    addadvisor,
    checkinvolunteer,
    checkoutvolunteer,
    getactivevolunteers,
};

function generateHash (password) {
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

//function used to register a new user 
function register({firstName, lastName, email, phone, requestLevel, advisorEmail, schoolId, password}) {
    // newly registered users are automatically given access level 1 unless they are an advisor
    // otherwise they must be upgraded by an admin
    accessLevel = requestLevel == constants.ADVISOR ? constants.ADVISOR : constants.STUDENT;
    return generateHash(password).then((encryptedPassword) => 
    {
        return db.none(`
        INSERT INTO Users
            (FirstName, LastName, Email, Phone, AccessLevel, RequestLevel, EncryptedPassword)
        VALUES($(firstName), $(lastName), $(email), $(phone), $(accessLevel), $(requestLevel), $(encryptedPassword))`, 
        {firstName, lastName, email, phone, accessLevel, requestLevel, encryptedPassword});
    }).then(() => 
    {
        // if they are registering as a student, we also need to create a Student record
        if (requestLevel == constants.STUDENT) {
            return db.none(`
            INSERT INTO Student
                (UserID, AdvisorID)
            VALUES(
                (SELECT UserID FROM Users WHERE Email = $(email)),
                (SELECT UserID FROM Users WHERE Email = $(advisorEmail))
            )`, {email, advisorEmail});
        }else if (requestLevel == constants.ADVISOR) {
            // if they are registering as an advisor, we need to add an AdvisorsAffiliation record
            return db.none(`
            INSERT INTO AdvisorsAffiliation
                (UserID, SchoolID)
            VALUES(
                (SELECT UserID FROM Users WHERE Email = $(email)),
                $(schoolId)
            )`, {email, schoolId});
        }
    });
}


function casRegister(firstName, lastName, email, accessLevel) {
    return db.none(`INSERT INTO Users
        (FirstName, LastName, Email, AccessLevel, RequestLevel)
        VALUES($(firstName), $(lastName), $(email), $(accessLevel), $(accessLevel))`,
        {firstName, lastName, email, accessLevel: constants.VOLUNTEER})
}

/**
 * Returns the login information for the user with the given email
 * @param {String} email 
 * @returns 
 */
function getLogin(email) {
    return db.any(`SELECT U.UserID,
                U.Email,
                U.EncryptedPassword,
                U.AccessLevel,
                U.FirstName,
                U.LastName
            FROM Users AS U
            WHERE Email = $(email)`, {
                email
            }).then((data) =>  {
                data = renameKeys(data, ['id', 'email', 'encryptedPassword', 'accessLevel', 'firstName', 'lastName']);
                return data.length > 0 ? data[0] : null; 
            });
}

//function to get all the user information for each user in the Users table
function getAllUsers() {
    return db.any(`
    SELECT U.UserID, 
        U.FirstName,
        U.LastName,
        U.Email,
        U.Phone,
        R.Role
    FROM Users AS U
    INNER JOIN Roles AS R on R.Level = U.AccessLevel`);
}

/*
* get all users from database where access level is equal to volunteer
*
* @author: Trey Moddelmog
*/
function getAllVolunteers() {
    return db.any(
        `SELECT U.UserID, U.FirstName, U.LastName, U.Email
        FROM Users AS U
        WHERE U.AccessLevel = 20`
    );
}


//gets all the roles that a use can be - master, admin, advisor, etc.
function getAllRoles() {
    return db.any(`SELECT *
            FROM Roles`);
}

//function to get all the advisors (from AdvisorsAffiliation table) and their respective information
function getAdvisors(){
    return db.any(`SELECT Users.UserID, Users.FirstName, Users.LastName, Users.Email, School.SchoolName, Users.Phone FROM Users
    INNER JOIN AdvisorsAffiliation ON AdvisorsAffiliation.UserID = Users.UserID
    INNER JOIN School ON School.SchoolID = AdvisorsAffiliation.SchoolID;`)
}

// function to get the school associated with an advisor
function getAdvisorSchool(){
    return db.any(`SELECT School.SchoolName, School.SchoolID FROM School
    INNER JOIN AdvisorsAffiliation ON AdvisorsAffiliation.SchoolID = School.SchoolID
    INNER JOIN Users ON Users.UserID = AdvisorsAffiliation.UserID;`).then((data) =>  {
        data = renameKeys(data, ['name', 'id']);
        return data.length > 0 ? data[0] : null; 
    });
}

//function to get all the students and their respective information who are not on a team
function getStudents(){
    return db.any(`
    SELECT Users.Phone, Users.FirstName, Users.LastName, Users.Email, Users.AccessLevel 
    FROM Users 
    WHERE Users.AccessLevel = 1 
        AND NOT EXISTS (SELECT UserId FROM TeamsUsers WHERE Users.UserId = TeamsUsers.UserID);`)
}

//function to insert the school associated with an advisor into the advisor table
function advisorUpdateSchool(userId, schoolId){
    return db.none(`UPDATE AdvisorsAffiliation SET SchoolID = $(schoolId) WHERE UserID = $(userId)`, {userId, schoolId} )
}
///get students based on the Advisor Natalie Laughlin
function getStudentsFromAdvisors(email){
    return db.any(`
    SELECT Users.Phone, Users.Firstname, Users.LastName, Users.email, Users.AccessLevel  
    FROM users 
    INNER JOIN student on student.userId = Users.UserId 
    WHERE student.AdvisorID in (SELECT Users.userid FROM users WHERE Users.email = $(email))
        AND Users.AccessLevel = 1 
        AND NOT EXISTS (SELECT UserId FROM TeamsUsers WHERE Users.UserId = TeamsUsers.UserID);`, 
    {email})
}

///function to insert the user into the student table with their advisor after making a user Natalie Laughlin
function addstudent(firstName, lastName, email, phone, accessLevel, requestLevel, encryptedPassword, advisoremail){
   return db.none(`INSERT INTO Users (FirstName, LastName, Email, Phone, AccessLevel, RequestLevel, EncryptedPassword) VALUES($(firstName), $(lastName), $(email), $(phone), $(accessLevel), $(requestLevel), $(encryptedPassword)); 
   insert into student values((select userid from users where email= $(email)),(select userid from users where email=$(advisoremail)));`, {firstName, lastName, email, phone, accessLevel, requestLevel, encryptedPassword, advisoremail});
}

///function to insert the user into the (from AdvisorsAffiliation table) after making a user Natalie Laughlin
function addadvisor(firstName, lastName, email, phone, accessLevel, requestLevel, encryptedPassword, schoolname){
    return db.none(`INSERT INTO Users (FirstName, LastName, Email, Phone, AccessLevel, RequestLevel, EncryptedPassword) VALUES($(firstName), $(lastName), $(email), $(phone), $(accessLevel), $(requestLevel), $(encryptedPassword)); 
    insert into advisorsaffiliation values((select userid from users where email= $(email)),(select schoolid from school where schoolname=$(schoolname)));`, {firstName, lastName, email, phone, accessLevel, requestLevel, encryptedPassword, schoolname});
 }

///Function to get sutdents based on thier teamName
function getstudentsteam(teamName){
    return db.any(`select Users.Phone, Users.Firstname, Users.LastName, Users.email, Users.AccessLevel  From users inner join teamsusers on teamsUsers.userid = users.userid inner join Teams on teams.teamid = teamsusers.teamid where teams.teamname = $(teamName);`, {teamName})
}

//Function used to check in Volunteers based on userid
function checkinvolunteer(userid){
    return db.none(`UPDATE Users SET Active = 1 WHERE userId = $(userid)`, {userid})
}

//Function used to remove volunteer from being checked in
function checkoutvolunteer(userid){
    return db.none(`UPDATE Users SET Active = 0 WHERE userId = $(userid)`, userid)
}

//Function used to return all volunteers set as checked in
function getactivevolunteers(){
    return db.any(
    `SELECT U.UserID, U.FirstName, U.LastName, U.Email
    FROM Users AS U
    WHERE U.AccessLevel = 20 AND U.Active = 1`)
}
