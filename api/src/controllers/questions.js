/*
  reformated for questions view Natalie Laughlin
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
const questionsService = require("../services/questions.js");
const testcasesService = require("../services/testcases.js");
const judgingService = require("../services/judging.js");

/*
* API Endpoint that returns all questions in the database
*
* @author: Natalie Laughlin - formate taken from other classes authored by  Daniel Bell
* @param {string} endpoint location
* @param {JSON} callback function containing request and response data from the client.
*/
router.get('/view', (req, res) => {
    questionsService.getAllquestions()
        .then((userdata) => {
            statusResponses.ok(res, userdata);
        })
        .catch((err) => {
            statusResponses.serverError(res);
        });
});

router.post('/add', (req, res) => {
    const id = req.body['id'];
    const lvl = req.body['lvl'];
    const desc = req.body['description'];
    questionsService.addQuestion(id, lvl, desc)
        .then((userdata) => {
            statusResponses.ok(res, userdata);
        })
        .catch((err) => {
            console.log("error adding question")
            statusResponses.serverError(res);
        });
});

router.delete('/remove', (req, res) => {
    const questionid = req.body['questionid'];
    questionsService.removeQuestion(questionid)
        .then((userdata) => {
            statusResponses.ok(res, userdata);
        })
        .catch((err) => {
            console.log("error removing question")
            statusResponses.serverError(res);
        });
});

router.delete('/removeasync', async (req, res) => {
    try {
        const questionid = req.body['questionid'];
        // get all testcases for this id
        const testcases = await testcasesService.getTestcases(questionid);
        testcases.forEach( async (e) => { await judgingService.removeJudgingForTestcase(e.testcaseid);})
        testcases.forEach( async (e) =>{ await testcasesService.removeTestcase(e.testcaseid);})
        questionsService.removeQuestion(questionid)
            .then((userdata) => {
                statusResponses.ok(res, userdata);
            })
        
    } catch (error)
    {
        console.log(error);
        statusResponses.serverError(error);
    }

});




module.exports = router;
