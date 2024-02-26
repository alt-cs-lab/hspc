/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
const db = require("../utils/hspc_db").db;
const {renameKeys} = require('../utils/extensions.js');


module.exports = {
    registerSchool: registerSchool,
    getAllSchools: getAllSchools,
    getAdvisorSchools: getAdvisorSchools
};

/**
 * Returns promise that creates a School entry.
 * Accepts a request body with the following keys:
 * * name
 * * addressLine1
 * * addressLine2
 * * city
 * * state
 * * postalCode
 * * usdCode
 * @param {Object} reqBody Request body.
 * @returns {Promise} Promise that resolves to an error if there is one.
 */
function registerSchool({name, addressLine1, addressLine2, city, state, postalCode, usdCode}){
    return db.none(`INSERT INTO Schools (SchoolName, AddressLine1, AddressLine2, City, "State", PostalCode, USDCode)
                VALUES ( $(name), $(addressLine1), $(addressLine2), $(city), $(state), $(postalCode), $(usdCode))`, 
                {name, addressLine1, addressLine2, city, state, postalCode, usdCode});
}

/**
 * Get all schools.
 * 
 * @returns {Promise} Promise that resolves to a list of schools.
 */
function getAllSchools(){
    return db.any(`SELECT * FROM Schools`)
        .then((schools) => renameKeys(schools, ["id", "name", "addressLine1", "addressLine2", "city", "state", "postalCode", "usdCode"]));
}

/**
 * Gets all the schools associated with an advisor.
 * @param {int} userId The advisor's ID
 * @returns All the schools that an advisor is associated with.
 */
function getAdvisorSchools(userId) {
    return db.any(
        `
          SELECT S.SchoolID, S.SchoolName, S.City, S."State", S.USDCode
          FROM Schools S
              INNER JOIN SchoolAdvisors SA ON SA.SchoolID = S.SchoolID
          WHERE SA.UserID = $(userId)
        `,
      {userId}
      );
  }