const router = require('express').Router();
const {check} = require('express-validator');
const validator = require("validator");
const isEmpty = require("is-empty");
const passport = require("passport");
const statusResponses = require("../utils/status-response.js");
const {badRequestCheck, useService} = require("../utils/extensions.js");
const constants = require("../utils/constants.js");
const printService = require('../services/print.js');

/*
* API Endpoint that returns teams for a specified competition.
*
* @author: Logan Peppers
* @param {string} endpoint location
* @param {JSON} callback function containing request and response data from the client.
*/
router.get('/teams', (req, res) => {
    var comp = req.query['competition'];
    printService.getEventTeams(comp)
        .then((teamData) => {
            statusResponses.ok(res, teamData);
        })
        .catch((err) => {
            statusResponses.serverError(res);
        });
});

/*
* API Endpoint that returns volunteers for a specified competition.
*
* @author: Logan Peppers
* @param {string} endpoint location
* @param {JSON} callback function containing request and response data from the client.
*/
router.get('/volunteers', (req, res) => {
    var comp = req.query['competition'];
    printService.getEventVolunteers(comp)
        .then((volunteerData) => {
            statusResponses.ok(res, volunteerData);
        })
        .catch((err) => {
            statusResponses.serverError(res);
        });
});

module.exports = router;