/**
 * @fileoverview Service for assignments
 * @author Riley Mueller
 *
 * Has functions for get, create, approve, and remove
 */

// import the database
const db = require("../utils/hspc_db").db;
// used for formating the data from the database to be more readable
const { renameKeys } = require("../utils/extensions");
const constants = require("../utils/constants");

// every function is given an object as a parameter

// get returns a list of assignments
async function get({ user, eventId, volunteerId, approved, judgeAssignments }) {
    // filter on the eventId, volunteerId, approved, and type if it is given

    // if the user is not an admin, they can only see their own assignments
    volunteerId = user.accessLevel >= constants.ADMIN ? volunteerId : user.id;
    let whereList = [];
    let values = {};
    if (eventId) {
        whereList.push(`A.CompetitionID = $(eventId)`);
        values.eventId = eventId;
    }
    if (volunteerId) {
        whereList.push(`A.VolunteerID = $(volunteerId)`);
        values.volunteerId = volunteerId;
    }
    if (approved != null) {
        whereList.push(`A.Approved = $(approved)`);
        values.approved = approved;
    }

    if (!judgeAssignments || judgeAssignments == 'false') {
        // If we just want the volunteer assignments, return them
        let query = `SELECT A.AssignmentID, A.CompetitionID, A.VolunteerID, A.Approved, A.TimeAssigned FROM VolunteerAssignment A`;
        // filter on the eventId, volunteerId, and approved, if given
        if (whereList.length > 0) {
            query += ` WHERE ${whereList.join(" AND ")}`;
        }
        return db
            .any(query, values)
            .then((data) => renameKeys(data, ["assignmentId", "eventId", "volunteerId", "approved", "timeAssigned"]));
    } else {
        // If we want the judge assignments, we need to join the tables
        let query = `SELECT A.AssignmentID, A.CompetitionID, A.VolunteerID, A.Approved, A.TimeAssigned, B.AssignmentID as JudgeAssignmentID, B.TimeAssigned as JudgeTimeAssigned, B.Approved as JudgeApproved FROM VolunteerAssignment A RIGHT JOIN JudgeAssignment B ON A.AssignmentID = B.VolunteerAssignmentID`;
        if (whereList.length > 0) {
            query += ` WHERE ${whereList.join(" AND ")}`;
        }
        // return the data
        return db
            .any(query, values)
            .then((data) =>
                renameKeys(data, [
                    "assignmentId",
                    "eventId",
                    "volunteerId",
                    "approved",
                    "timeAssigned",
                    "judgeAssignmentId",
                    "judgeTimeAssigned",
                    "judgeApproved",
                ])
            );
    }
}

// returns the new assignment
function create({ user, eventId, volunteerId, volunteerAssignmentId }) {
    // if the volunteerId is not given, use the current user
    volunteerId = volunteerId ? volunteerId : user.id;
    // if we are given volunteerAssignmentId this is a judge assignment. Otherwise it is a volunteer assignment
    const approved = user.accessLevel >= constants.ADMIN ? true : false;
    if (!volunteerAssignmentId) {
        // volunteer assignment
        return db
            .oneOrNone(
                `INSERT INTO VolunteerAssignment (CompetitionID, VolunteerID, Approved, TimeAssigned) VALUES ($(eventId), $(volunteerId), $(approved), NOW()) RETURNING AssignmentID, CompetitionID, VolunteerID, Approved, TimeAssigned`,
                { eventId, volunteerId, approved }
            )
            .then((data) => {
                return renameKeys([data], ["assignmentId", "eventId", "volunteerId", "approved", "timeAssigned"])[0];
            });
    } else {
        // judge assignment
        return db
            .oneOrNone(
                `INSERT INTO JudgeAssignment (VolunteerAssignmentID, TimeAssigned, Approved) VALUES ($(volunteerAssignmentId), NOW(), $(approved)) RETURNING AssignmentID, VolunteerAssignmentID, TimeAssigned, Approved`,
                { volunteerAssignmentId, approved }
            )
            .then((data) => renameKeys([data], ["assignmentId", "volunteerAssignmentId", "timeAssigned", "approved"])[0]);
    }
}

// updates the given assignment's approved value to the passed approved value
function update({ approved, volunteerAssignmentId, judgeAssignmentId }) {
    if (judgeAssignmentId) {
        // judge assignment
        return db
            .oneOrNone(
                `UPDATE JudgeAssignment SET Approved = $(approved) WHERE AssignmentID = $(judgeAssignmentId) RETURNING AssignmentID, VolunteerAssignmentID, TimeAssigned, Approved`,
                { approved, judgeAssignmentId }
            )
            .then((data) => renameKeys([data], ["assignmentId", "volunteerAssignmentId", "timeAssigned", "approved"])[0]);
    } else {
        // volunteer assignment
        return db
            .oneOrNone(
                `UPDATE VolunteerAssignment SET Approved = $(approved) WHERE AssignmentID = $(volunteerAssignmentId) RETURNING AssignmentID, CompetitionID, VolunteerID, Approved, TimeAssigned`,
                { approved, volunteerAssignmentId }
            )
            .then((data) => {
                return renameKeys([data], ["assignmentId", "eventId", "volunteerId", "approved", "timeAssigned"])[0];
            });
    }
}
function remove({ volunteerAssignmentId, judgeAssignmentId }) {
    if (judgeAssignmentId) {
        // judge assignment
        return db
            .oneOrNone(`DELETE FROM JudgeAssignment WHERE AssignmentID = $(judgeAssignmentId) RETURNING AssignmentID`, {
                judgeAssignmentId,
            })
            .then((data) => renameKeys([data], ["assignmentId"])[0]);
    } else {
        // volunteer assignment
        // must first delete all judge assignments associated with this volunteer assignment
        return db
            .oneOrNone(`DELETE FROM JudgeAssignment WHERE VolunteerAssignmentID = $(volunteerAssignmentId)`, {
                volunteerAssignmentId,
            })
            .then(() => {
                return db
                    .oneOrNone(
                        `DELETE FROM VolunteerAssignment WHERE AssignmentID = $(volunteerAssignmentId) RETURNING AssignmentID`,
                        { volunteerAssignmentId }
                    )
                    .then((data) => renameKeys([data], ["assignmentId"])[0]);
            });
    }
}

module.exports = {
    get,
    create,
    update,
    remove,
};
