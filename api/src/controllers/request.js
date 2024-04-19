/*
MIT License
Copyright (c) 2024 KSU-CS-Software-Engineering
*/
const router = require("express").Router();
const passport = require("passport");
const {
  badRequestCheck,
  useService,
  accessLevelCheck,
} = require("../utils/extensions.js");
const constants = require("../utils/constants.js");
const requestService = require("../services/request");
const statusResponses = require("../utils/status-response.js");

router.get('/allSchool', (req, res) => {
    // TWP TODO: Do Role Checking
    requestService.getAllSchoolRequests()
    .then((studentData) => {
        statusResponses.ok(res, studentData);
    })
    .catch((err) => {
        statusResponses.serverError(res);
    });
});

router.post("/completeSchool", (req, res) => {
    // TWP TODO: Do Role Checking
    useService(requestService.completeSchoolRequest, req, res);
});

router.post("/requestSchool", (req, res) => {
    // TWP TODO: Do Role Checking
    useService(requestService.requestSchool, req, res);
});

router.post("/completeTeamRegistration", (req, res) => {
    // TWP TODO: Do Role Checking
    useService(requestService.completeTeamRegistration, req, res);
});

router.get("/waitlistedTeamsForEvent", (req, res) => {
    // TWP TODO: Do Role Checking
    useService(requestService.requestWaitlistedTeamsForEvent, req, res);
});

module.exports = router;