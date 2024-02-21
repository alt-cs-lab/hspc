require("dotenv").config();

const db = require("../utils/hspc_db").db;
const constants = require("../utils/constants");
const { renameKeys } = require("../utils/extensions");
const bcrypt = require("bcrypt");

module.exports = {
    addHighSchoolStudent
}

function addHighSchoolStudent(firstName, lastName, school, email, gradDate) {
    // FINISH
}
