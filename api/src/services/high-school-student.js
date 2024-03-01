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
    createStudent
}

function createStudent( { firstName, lastName, schoolId, email, gradDate } ) {
    console.log({ firstName, lastName, schoolId, email, gradDate });
    return db.none(
    `
        INSERT INTO HighSchoolStudents (FirstName, LastName, SchoolID, Email, GradDate)
        VALUES($(firstName), $(lastName), $(schoolId), $(email), $(gradDate))    
    `,
    {
        firstName, lastName, schoolId, email, gradDate
    }
    );
}


