/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
const router = require('express').Router();
const statusResponses = require("../utils/status-response.js");
const practiceService = require("../services/practice.js");
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
}).single('practice');

const { useService } = require("../utils/extensions.js");
const passport = require("passport");
const { minimumAccessLevelCheck, badRequestCheck } = require("../utils/extensions.js");
const {check} = require("express-validator");
const constants = require("../utils/constants.js");

/*
* API Endpoint that serves the uploading of files of practice problems.
*
* @author: Daniel Bell
* @param {string} endpoint location
* @param {JSON} callback function containing request and response data from the client.
*/
router.post('/create', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            if (err.name === 'MulterError') {
                statusResponses.badRequest(res, err);
            }
            else {
                statusResponses.serverError(res);
            }
        }
        else if (req.file && req.file.buffer.byteLength > 0) {
            practiceService.addPractice(req.file)
                .then(() => {
                    statusResponses.created(res, `File Uploaded Successfully!`);
                })
                .catch((err) => {
                    statusResponses.serverError(res);
                });
        }
        else {
            statusResponses.badRequest(res, 'File Required');
        }
    });
});

/*
* API endpoint that returns all practice problem files stored in the database.
*
* @author: Daniel Bell
* @param {string} endpoint location
* @param {JSON} callback function containing request and response data from the client.
*/
router.get('/view', (req, res) => {
    practiceService.getAllPractice()
        .then((scores) => {
            statusResponses.ok(res, scores);
        })
        .catch((err) => {
            statusResponses.serverError(res);
        });
});

module.exports = router;