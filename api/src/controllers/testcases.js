/*
  testcases controller Steven Blair 
  Based off other controllers
*/

/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
const router = require('express').Router();
const { useService } = require("../utils/extensions.js");
const passport = require("passport");
const { accessLevelCheck, badRequestCheck } = require("../utils/extensions.js");
const {check} = require("express-validator");
const constants = require("../utils/constants.js");

const statusResponses = require("../utils/status-response.js");
const testcasesService = require("../services/testcases.js");
const judgingService = require("../services/judging.js");

/*
* API Endpoint that returns all testcases in the database
*
* @param {string} endpoint location
* @param {JSON} callback function containing request and response data from the client.
*/
router.get('/view', (req, res) => {
    testcasesService.getAllTestcases()
        .then((userdata) => {
            statusResponses.ok(res, userdata);
        })
        .catch((err) => {
            statusResponses.serverError(res);
        });
});




/*
* API Endpoint that returns current test cases by question id
*
* @author: May Phyo
* @param {string} endpoint location
* @param {JSON} callback function containing request and response data from the client.
*/
router.post('/gettestcasesbyid', (req, res) => {
    const questionid = req.body['questionid'];
    testcasesService.getTestcasesByID(questionid)
        .then((userdata) => {
            statusResponses.ok(res, userdata);
        })
        .catch((err) => {
            statusResponses.serverError(res);
        });
});



router.get('/viewid', (req, res) => {
    const questionid = req.query.questionid;
    console.log(questionid);
    testcasesService.getTestcases(questionid)
        .then((userdata) => {
            statusResponses.ok(res, userdata);
        })
        .catch((err) => {
            statusResponses.serverError(res);
        });
});

router.post('/add', (req, res) => {
    const testcaseid = req.body['testcaseid'];
    const questionid = req.body['questionid'];
    const round = req.body['round'];
    const desc = req.body['description'];
    testcasesService.addTestcase(testcaseid,questionid, round, desc)
        .then((userdata) => {
            statusResponses.ok(res, userdata);
        })
        .catch((err) => {
            console.log("error adding testcase")
            statusResponses.serverError(res);
        });
});

router.post('/edit', (req, res) => {
    const testcaseid = req.body['testcaseid'];
    const questionid = req.body['questionid'];
    const round = req.body['round'];
    const desc = req.body['description'];
    testcasesService.editTestcase(testcaseid,questionid, round, desc)
        .then((userdata) => {
            statusResponses.ok(res, userdata);
        })
        .catch((err) => {
            console.log("error editing testcase")
            console.log(err);
            statusResponses.serverError(res);
        });
});

router.delete('/remove', async (req, res) => {
    try {
        const id = req.body['testcaseid'];
        // remove judging results, then testcase
        await judgingService.removeJudgingForTestcase(id)
        await testcasesService.removeTestcase(id);
        statusResponses.ok(res, []);
    } catch (error) {
        console.log(error);
        statusResponses.serverError(res);
    }

});




module.exports = router;
