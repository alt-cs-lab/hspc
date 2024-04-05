/*
MIT License
Copyright (c) 2024 KSU-CS-Software-Engineering
*/

require("dotenv").config();
const db = require("../utils/hspc_db").db;
const constants = require("../utils/constants.js");

module.exports = {
    getAllSchoolRequests,
    completeSchoolRequest,
    requestSchool,
}

function getAllSchoolRequests() {
    let pending = constants.ADVISOR_STATUS_PENDING
    return db.any(
        `
            SELECT SA.AdvisorID, SA.UserID, SA.SchoolID, U.FirstName, U.LastName, U.Phone, U.Email, S.SchoolName
            FROM SchoolAdvisors SA
                INNER JOIN Schools S ON S.SchoolID = SA.SchoolID
                INNER JOIN Users U ON U.UserID = SA.UserID
            WHERE SA.AdvisorStatusID = $(pending)
        `, { pending });
}

function completeSchoolRequest( { approved, schoolid, advisorid }){
    if(approved){
        let statusApproved = constants.ADVISOR_STATUS_APPROVED
        return db.none(`
                UPDATE SchoolAdvisors SA
                SET AdvisorStatusID = $(statusApproved)
                WHERE SA.SchoolID = $(schoolid) AND SA.UserID = $(advisorid);
            `, { statusApproved, schoolid, advisorid } );
    }
    else{
        // TODO TWP: Verify deletion below is alright
        let statusDenied = constants.ADVISOR_STATUS_DENIED
        return db.none(`
                UPDATE SchoolAdvisors SA
                SET AdvisorStatusID = $(statusDenied)
                WHERE SA.SchoolID = $(schoolid) AND SA.UserID = $(advisorid);
            `, { statusDenied, schoolid, advisorid } );
    }
}

function requestSchool( { schoolid, advisorid } ) {
    let pending = constants.ADVISOR_STATUS_PENDING
    return db.none( `
        INSERT INTO SchoolAdvisors (UserID, SchoolID, AdvisorStatusID)
        VALUES($(advisorid), $(schoolid), $(pending))
    `,{ schoolid, advisorid, pending });
}