/*
 * judging service - Steven Blair
*/

const db = require("../utils/hspc_db").db;

module.exports = {
    getAllJudgingResults: getAllJudgingResults,
    judgeTestcase: judgeTestcase,
    updateJudgedTestcase: updateJudgedTestcase,
    testcaseJudgedAlready: testcaseJudgedAlready,
    removeJudgingForTestcase: removeJudgingForTestcase,
    getTeamAssignmentsForJudge : getTeamAssignmentsForJudge,
    testcaseResult: testcaseResult,
};

/*function addPractice(practice){
    return db.none(`INSERT INTO Files(FileData, FileType, FileGroup)
            VALUES(@practice, '${practice.mimetype}', 'Practice')`);
}*/

function getAllJudgingResults(){
    return db.any(`SELECT * FROM judging ORDER BY teamid ASC`);
}

async function testcaseJudgedAlready(teamid,questionid,testcaseid, pass) {
    const exists = await db.oneOrNone(`SELECT * FROM judging WHERE
        teamid = $(teamid) AND
        questionid = $(questionid) AND
        testcaseid = $(testcaseid)`, {teamid,questionid,testcaseid});
    return exists != null;
}

function testcaseResult(teamid,questionid,testcaseid, pass) {
    return db.oneOrNone(`SELECT * FROM judging WHERE
        teamid = $(teamid) AND
        questionid = $(questionid) AND
        testcaseid = $(testcaseid)`, {teamid,questionid,testcaseid,pass});
}

async function updateJudgedTestcase(teamid,questionid,testcaseid, pass) {
    return await db.any(
        `UPDATE judging
         SET pass = $(pass)
         WHERE 
            teamid = $(teamid) AND
            questionid = $(questionid) AND
            testcaseid = $(testcaseid)
        `, {teamid,questionid,testcaseid, pass});
}

async function judgeTestcase(teamid,questionid,testcaseid, pass) {
    return await db.any(
        `INSERT INTO judging
        (teamid,questionid,testcaseid,pass) VALUES
            (
            '$(teamid)',
            '$(questionid)',
            '$(testcaseid)',
            '$(pass)'
            )`,
            {teamid,questionid,testcaseid, pass});
}

// removes results for all teams
// used when deleting a testcase
async function removeJudgingForTestcase(testcaseid)
{
    return await db.any(
        `DELETE FROM judging WHERE testcaseid =  '$(testcaseid)'`,
        {testcaseid});
}

function getTeamAssignmentsForJudge(email)
{
    return db.any(
        `SELECT * FROM teams`);
}

