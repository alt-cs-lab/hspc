/*
MIT License
Copyright (c) 2024 KSU-CS-Software-Engineering
*/

require("dotenv").config();

const db = require("../utils/hspc_db").db;
// const constants = require("../utils/constants");
// const { renameKeys } = require("../utils/extensions");
const bcrypt = require("bcrypt");

module.exports = {
    addHighSchoolStudent
}

function addHighSchoolStudent(firstName, lastName, schoolID, email, gradDate) {
    return db.none(
    `
        INSERT INTO HighSchoolStudents (FirstName, LastName, SchoolID, Email, GradDate)
        VALUES($(firstName), $(lastName), $(schoolID), $(email), $(gradDate))    
    `,
    {
        firstName, lastName, schoolID, email, gradDate
    }
    );
}
