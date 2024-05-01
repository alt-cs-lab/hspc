/*
 * Controllers for questions functionality
 * Author: 
 * Modified: 
 */
const router = require("express").Router();
const { useService } = require("../utils/extensions.js");
const passport = require("passport");
const { accessLevelCheck, badRequestCheck } = require("../utils/extensions.js");
const { check } = require("express-validator");
const constants = require("../utils/constants.js");

const statusResponses = require("../utils/status-response.js");
const questionsService = require("../services/questions.js");
const testcasesService = require("../services/testcases.js");
const judgingService = require("../services/judging.js");

/*
 * API Endpoint that returns all questions in the database
 */
router.get("/view", (req, res) => {
  questionsService
    .getAllquestions()
    .then((userdata) => {
      statusResponses.ok(res, userdata);
    })
    .catch((err) => {
      statusResponses.serverError(res);
    });
});

/*
 * API Endpoint that adds a question to the database
 */
router.post("/add", (req, res) => {
  const id = req.body["id"];
  const lvl = req.body["lvl"];
  const desc = req.body["description"];
  questionsService
    .addQuestion(id, lvl, desc)
    .then((userdata) => {
      statusResponses.ok(res, userdata);
    })
    .catch((err) => {
      console.log("error adding question");
      statusResponses.serverError(res);
    });
});

/*
 * API Endpoint that deletes a question from the database
 */
router.delete("/remove", (req, res) => {
  const questionid = req.body["questionid"];
  questionsService
    .removeQuestion(questionid)
    .then((userdata) => {
      statusResponses.ok(res, userdata);
    })
    .catch((err) => {
      console.log("error removing question");
      statusResponses.serverError(res);
    });
});

router.delete("/removeasync", async (req, res) => {
  try {
    const questionid = req.body["questionid"];
    const testcases = await testcasesService.getTestcases(questionid);
    testcases.forEach(async (e) => {
      await judgingService.removeJudgingForTestcase(e.testcaseid);
    });
    testcases.forEach(async (e) => {
      await testcasesService.removeTestcase(e.testcaseid);
    });
    questionsService.removeQuestion(questionid).then((userdata) => {
      statusResponses.ok(res, userdata);
    });
  } catch (error) {
    console.log(error);
    statusResponses.serverError(error);
  }
});

module.exports = router;
