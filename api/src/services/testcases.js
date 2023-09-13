/*
    testcases service Steven Blair 
*/

const db = require("../utils/hspc_db").db;

module.exports = {
    getAllTestcases: getAllTestcases,
    getTestcases: getTestcases,
    addTestcase: addTestcase,
    editTestcase: editTestcase,
    removeTestcase: removeTestcase,
    getTestcasesByID: getTestcasesByID,
};

function getAllTestcases(){
    return db.any(`SELECT * FROM testcases order by testcaseid ASC`);
}

function getTestcasesByID(questionid){
    return db.any(
        `SELECT * FROM testcases WHERE questionid = $questionid`, {questionid}
    );
}
function getTestcases(id){
    return db.any(`SELECT * FROM testcases WHERE
        questionid = $(id)
        ORDER BY testcaseid ASC`, {id});
}

function addTestcase(testcaseid, questionid, round, description){
    return db.any(`INSERT INTO testcases (testcaseid, questionid, round, description)
    VALUES (
        $(testcaseid),
        $(questionid),
        $(round),
        $(description)
    )`, {testcaseid,questionid,round,description});
}

function editTestcase(testcaseid, questionid, round, description){
    return db.any(`UPDATE testcases SET
            round = $(round),
            description = $(description)
        WHERE
            testcaseid = $(testcaseid) AND
            questionid = $(questionid)
    `, {testcaseid, questionid, round,description});
}

function removeTestcase(id){
    return db.any(`DELETE FROM testcases WHERE testcaseid= $(id)`, {id});
}
