/**
 * Services for school functionality
 */
const db = require("../utils/hspc_db").db;
const { renameKeys } = require("../utils/extensions.js");
const constants = require("../utils/constants.js");

module.exports = {
  registerSchool: registerSchool,
  getAllSchools: getAllSchools,
  getAdvisorApprovedSchools: getAdvisorApprovedSchools,
  getAdvisorSchools: getAdvisorSchools,
};

/**
 * Creates a given school
 */
function registerSchool({
  name,
  addressLine1,
  addressLine2,
  city,
  state,
  postalCode,
  usdCode,
}) {
  return db.none(
    `INSERT INTO Schools (SchoolName, AddressLine1, AddressLine2, City, "State", PostalCode, USDCode)
                VALUES ( $(name), $(addressLine1), $(addressLine2), $(city), $(state), $(postalCode), $(usdCode))`,
    { name, addressLine1, addressLine2, city, state, postalCode, usdCode }
  );
}

/**
 * Get all schools.
 */
function getAllSchools() {
  return db
    .any(`SELECT * FROM Schools`)
    .then((schools) =>
      renameKeys(schools, [
        "schoolid",
        "schoolname",
        "addressLine1",
        "addressLine2",
        "city",
        "state",
        "postalcode",
        "usdcode",
      ])
    );
}

/**
 * Gets all the approved schools associated with a given advisor.
 */
function getAdvisorApprovedSchools(userId) {
  let approved = constants.ADVISOR_STATUS_APPROVED;
  return db.any(
    `
        SELECT S.SchoolID, S.SchoolName, S.City, S."State", S.USDCode
        FROM Schools S
            INNER JOIN SchoolAdvisors SA ON SA.SchoolID = S.SchoolID
        WHERE SA.UserID = $(userId) AND SA.AdvisorStatusID = $(approved)
      `,
    { userId, approved }
  );
}

/**
 * Gets all the schools associated with a given advisor.
 */
function getAdvisorSchools(userId) {
  return db.any(
    `
        SELECT S.SchoolID, S.SchoolName, S.City, S."State", S.USDCode, ADS.Status
        FROM Schools S
            INNER JOIN SchoolAdvisors SA ON SA.SchoolID = S.SchoolID
            INNER JOIN AdvisorStatus ADS ON ADS.StatusID = SA.AdvisorStatusID
        WHERE SA.UserID = $(userId)
      `,
    { userId }
  );
}
