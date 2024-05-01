/**
 * Controllers for authentication and registration functionality
 * Author:
 * Modified: 5/1/2024
 */
const router = require("express").Router();
const { check } = require("express-validator");
const authService = require("../services/auth");

const { badRequestCheck, useService } = require("../utils/extensions");

/**
 * Calls the API and logs a user in and returns a JWT token
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
 * THIS HAS BEEN POSTPONED UNTIL CAS SYSTEM IS SET UP AGAIN FOR STUDENT LOGIN AS VOLUNTEERS
 *
 * @api {post} /api/auth/verify Verify
 * @apiName Verify
 * @apiGroup Auth
 * @apiDescription Verifies a user against the CAS service and returns a JWT token on success.
 *
 * @apiBody {String} ticket The cas ticket to verify
 * @apiBody {String} password The password of the User to login
 *
 * @apiSuccess (Success 200) {Number} success HTTP status code indicating success
 * @apiSuccess (Success 200) {String} token The JWT token
 *
 * @apiError (Error 400) {String} text List of errors
 */
/*router.post("/verify", [
    check("ticket")
        .not()
        .isEmpty().withMessage("CAS ticket required."),
    check(["firstName", "lastName"])
        .custom( (value, { req }) => retVal = !value || (!!req.body.firstName && !!req.body.lastName))
], badRequestCheck, async (req, res) => {

    const ticket = req.body['ticket']
    const firstName = req.body['firstName']
    const lastName = req.body['lastName']
    const serviceHost = encodeURI(process.env.SERVICE_HOST)
    const url = process.env.CAS_HOST
        + "serviceValidate?ticket=" + ticket
        + "&service=" + serviceHost + "ticket" + ((firstName && lastName) ? "/register" : "")

    authService.loginOrRegister(url, firstName, lastName)
        .then(data => statusResponse.ok(res, data))
        .catch( _ => statusResponse.badRequest(res))
})*/

module.exports = router;
