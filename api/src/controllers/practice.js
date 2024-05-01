/*
 * Controllers for practice functionality
 */
const router = require("express").Router();
const statusResponses = require("../utils/status-response.js");
const practiceService = require("../services/practice.js");
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
}).single("practice");

const { useService } = require("../utils/extensions.js");
const passport = require("passport");
const { accessLevelCheck, badRequestCheck } = require("../utils/extensions.js");
const { check } = require("express-validator");
const constants = require("../utils/constants.js");

/*
 * API Endpoint that serves the uploading of files of practice problems.
 */
router.post("/create", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      if (err.name === "MulterError") {
        statusResponses.badRequest(res, err);
      } else {
        statusResponses.serverError(res);
      }
    } else if (req.file && req.file.buffer.byteLength > 0) {
      practiceService
        .addPractice(req.file)
        .then(() => {
          statusResponses.created(res, `File Uploaded Successfully!`);
        })
        .catch((err) => {
          statusResponses.serverError(res);
        });
    } else {
      statusResponses.badRequest(res, "File Required");
    }
  });
});

/*
 * API endpoint that returns all practice problem files stored in the database.
 */
router.get("/view", (req, res) => {
  practiceService
    .getAllPractice()
    .then((scores) => {
      statusResponses.ok(res, scores);
    })
    .catch((err) => {
      statusResponses.serverError(res);
    });
});

module.exports = router;
