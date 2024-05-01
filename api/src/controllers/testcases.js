/**
 * Controllers for test cases
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
const testcasesService = require("../services/testcases.js");
const judgingService = require("../services/judging.js");

/*
 * API Endpoint that returns all testcases in the database
 */
router.get("/view", (req, res) => {
  testcasesService
    .getAllTestcases()
    .then((userdata) => {
      statusResponses.ok(res, userdata);
    })
    .catch((err) => {
      statusResponses.serverError(res);
    });
});

/*
 * API Endpoint that returns current test cases by question id
 */
router.post("/gettestcasesbyid", (req, res) => {
  const questionid = req.body["questionid"];
  testcasesService
    .getTestcasesByID(questionid)
    .then((userdata) => {
      statusResponses.ok(res, userdata);
    })
    .catch((err) => {
      statusResponses.serverError(res);
    });
});

/*
 * API Endpoint that returns test cases based on a given question id
 */
router.get("/viewid", (req, res) => {
  const questionid = req.query.questionid;
  console.log(questionid);
  testcasesService
    .getTestcases(questionid)
    .then((userdata) => {
      statusResponses.ok(res, userdata);
    })
    .catch((err) => {
      statusResponses.serverError(res);
    });
});

/**
 * Adds a new test case
 */
router.post("/add", (req, res) => {
  const testcaseid = req.body["testcaseid"];
  const questionid = req.body["questionid"];
  const round = req.body["round"];
  const desc = req.body["description"];
  testcasesService
    .addTestcase(testcaseid, questionid, round, desc)
    .then((userdata) => {
      statusResponses.ok(res, userdata);
    })
    .catch((err) => {
      console.log("error adding testcase");
      statusResponses.serverError(res);
    });
});

/**
 * Edits an existing test case based on the test case and question ids
 */
router.post("/edit", (req, res) => {
  const testcaseid = req.body["testcaseid"];
  const questionid = req.body["questionid"];
  const round = req.body["round"];
  const desc = req.body["description"];
  testcasesService
    .editTestcase(testcaseid, questionid, round, desc)
    .then((userdata) => {
      statusResponses.ok(res, userdata);
    })
    .catch((err) => {
      console.log("error editing testcase");
      console.log(err);
      statusResponses.serverError(res);
    });
});

/**
 * Removes a test case based on its id
 */
router.delete("/remove", async (req, res) => {
  try {
    const id = req.body["testcaseid"];
    // remove judging results, then testcase
    await judgingService.removeJudgingForTestcase(id);
    await testcasesService.removeTestcase(id);
    statusResponses.ok(res, []);
  } catch (error) {
    console.log(error);
    statusResponses.serverError(res);
  }
});

module.exports = router;
