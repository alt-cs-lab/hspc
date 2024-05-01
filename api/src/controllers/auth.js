/**
 * Controllers for authentication and registration functionality
 * Author: 
 * Modified: 
 */
const router = require("express").Router();
const { check } = require("express-validator");
const authService = require("../services/auth");

const { badRequestCheck, useService } = require("../utils/extensions");
const statusResponse = require("../utils/status-response");

/**
 * Logs a user in and returns a JWT token.
 */
router.post(
  "/login",
  [
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Invalid email format.")
      .normalizeEmail(),
    check("password").not().isEmpty().withMessage("Password is required"),
  ],
  badRequestCheck,
  (req, res) => {
    useService(authService.login, req, res);
  }
);

/**
 * Verifies a user against the CAS service and returns a JWT token on success.
 */
router.post(
  "/verify",
  [
    check("ticket").not().isEmpty().withMessage("CAS ticket required."),
    check(["firstName", "lastName"]).custom(
      (value, { req }) =>
        (retVal = !value || (!!req.body.firstName && !!req.body.lastName))
    ),
  ],
  badRequestCheck,
  async (req, res) => {
    const ticket = req.body["ticket"];
    const firstName = req.body["firstName"];
    const lastName = req.body["lastName"];
    const serviceHost = encodeURI(process.env.SERVICE_HOST);
    const url =
      process.env.CAS_HOST +
      "serviceValidate?ticket=" +
      ticket +
      "&service=" +
      serviceHost +
      "ticket" +
      (firstName && lastName ? "/register" : "");

    authService
      .loginOrRegister(url, firstName, lastName)
      .then((data) => statusResponse.ok(res, data))
      .catch((_) => statusResponse.badRequest(res));
  }
);

module.exports = router;
