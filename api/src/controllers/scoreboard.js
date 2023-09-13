/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
const router = require('express').Router();
const statusResponses = require("../utils/status-response.js");
const scoreService = require("../services/event.js");
const { useService } = require("../utils/extensions.js");
const passport = require("passport");
const { minimumAccessLevelCheck, badRequestCheck } = require("../utils/extensions.js");
const {check} = require("express-validator");
const constants = require("../utils/constants.js");

/*
* API Endpoint serving the creation of a scoreboard.
*
* @author: Natalie Laughlin - Formate taken from classes authored by Daniel Bell
* @param {string} endpoint location
* @param {JSON} callback function containing request and response data from the client.
*/
router.post('/create', (req, res) => {
    const eventDate = req.body['eventDate'];
    const teamid = req.body['teamid'];

    scoreService.createScore(eventDate, teamid)
        .then(() => {
            statusResponses.created(res, `Event Scheduled Successfully!`);
        })
        .catch((err) => {
            statusResponses.serverError(res);
        });
});

/*
* API Endpoint that serves the retrieval of scoreboards from the database.
*
* @author: Natalie Laughlin - Formate taken from classes authored by Daniel Bell
* @param {string} endpoint location
* @param {JSON} callback function containing request and response data from the client.
*/
router.get('/view', (req, res) => {
    const eventDate = req.body['eventDate'];  //need user email
    scoreService.getScore(eventDate)
        .then((userdata) => {
            statusResponses.ok(res, userdata);
        })
        .catch((err) => {
            statusResponses.serverError(res);
        });
});

/*
* API endpoint that returns the teams corect answers
*
* @author: Natalie Laughlin - Formate taken from classes authored by Daniel Bell
* @param {string} endpoint location
* @param {JSON} callback function containing request and response data from the client.
*/
router.get('/getteamscore', (req, res) => {
    const teamName = req.body['teamName'];
    scoreService.getteamscore(teamName)
    .then((userdata) => {
        statusResponses.ok(res, userdata);
    })
    .catch((err) => {
        statusResponses.serverError(res);
    });
});
/*
* API endpoint that returns the teams wrong answers
*
* @author: Natalie Laughlin - Formate taken from classes authored by Daniel Bell
* @param {string} endpoint location
* @param {JSON} callback function containing request and response data from the client.
*/
router.get('/getteamwrong', (req, res) => {
    const teamName = req.body['teamName'];
    scoreService.getteamwrong(teamName)
    .then((userdata) => {
        statusResponses.ok(res, userdata);
    })
    .catch((err) => {
        statusResponses.serverError(res);
    });
});


/*
* API Endpoint that serves the retrieval number of questions for the competition from the database.
*
* @author: Natalie Laughlin - Formate taken from classes authored by Daniel Bell
* @param {string} endpoint location
* @param {JSON} callback function containing request and response data from the client.
*/
router.get('/getquestions', (req, res) => {
    const eventDate = req.body['eventDate'];  //need user email
    scoreService.getquestions(eventDate)
        .then((userdata) => {
            statusResponses.ok(res, userdata);
        })
        .catch((err) => {
            statusResponses.serverError(res);
        });
});

module.exports = router;
