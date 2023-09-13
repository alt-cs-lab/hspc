/*
 * judging controller steven blair
*/

/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
const router = require('express').Router();
const { useService } = require("../utils/extensions.js");
const passport = require("passport");
const { minimumAccessLevelCheck, badRequestCheck } = require("../utils/extensions.js");
const {check} = require("express-validator");
const constants = require("../utils/constants.js");

const statusResponses = require("../utils/status-response.js");
const judgingService = require("../services/judging.js");

/*
*
* @param {string} endpoint location
* @param {JSON} callback function containing request and response data from the client.
*/
router.get('/view', (req, res) => {
    judgingService.getAllJudgingResults()
        .then((userdata) => {
            statusResponses.ok(res, userdata);
        })
        .catch((err) => {
            statusResponses.serverError(res);
        });
});

router.get('/viewResult', async (req, res) => {
    try {
        const teamid = req.query.teamid;
        const questionid = req.query.questionid;
        const testcaseid = req.query.testcaseid;
        const passFail = await judgingService.testcaseResult(teamid, questionid, testcaseid);
            statusResponses.ok(res, passFail);

    } catch (error) {
        console.log(error);
        statusResponses.serverError(res);
    }
});

router.get('/assignedTeams',async (req, res) => {
    try {
        const email = req.query['email'];
        console.log(email);
        const teams = await judgingService.getTeamAssignmentsForJudge(email);
        statusResponses.ok(res, teams);
    }
    catch (error) {
        console.log(error);
        statusResponses.serverError(error);
    }

});

router.put('/judgeasync', async (req, res) => {
    try {
        const teamid = req.body['teamid'];
        const questionid = req.body['questionid'];
        const testcaseid = req.body['testcaseid'];
        const pass = req.body['pass'];
        const exists = await judgingService.testcaseJudgedAlready(teamid,questionid,testcaseid);
        if (exists) {
            // update row 
            console.log("updating testcase result");
            const data = await judgingService.updateJudgedTestcase(teamid,questionid,testcaseid,pass);
            statusResponses.ok(res, data);
        }
        else {
            // insert row
            console.log("inserting new judged testcase result");
            const data = await judgingService.judgeTestcase(teamid,questionid,testcaseid,pass);
            statusResponses.ok(res, data);
        }
    } catch (error) {
        console.log(error);
        statusResponses.serverError(res);
    }
});

router.delete('/removealltid', async (req, res) => {
    try {
        const testcaseid = req.body['testcaseid'];
        console.log("removing testcase from judging results");
        const data = await judgingService.removeJudgingForTestcase(testcaseid);
        statusResponses.ok(res, data);

    } catch (error) {
        console.log(error);
        statusResponses.serverError(res);
    }
});

module.exports = router;
