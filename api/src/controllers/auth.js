/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
const router = require('express').Router();
const { check } = require('express-validator');
const authService = require('../services/auth');

const {badRequestCheck, useService} = require('../utils/extensions');
const statusResponse = require('../utils/status-response');


/**
 * @api {post} /api/auth/login Login
 * @apiName Login
 * @apiGroup Auth
 * @apiDescription Logs a user in and returns a JWT token.
 * 
 * @apiBody {String} email The email of the User to login
 * @apiBody {String} password The password of the User to login
 * 
 * @apiSuccess (Success 200) {Number} success HTTP status code indicating success
 * @apiSuccess (Success 200) {String} token The JWT token
 * 
 * @apiError (Error 400) {String} text List of errors
 */
router.post('/login', [
    check('email')
        .not()
        .isEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Invalid email format.")
        .normalizeEmail(),
    check('password')
        .not()
        .isEmpty().withMessage("Password is required")
], badRequestCheck, (req,res) => {
    useService(authService.login,req, res);
});

/**
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
router.post("/verify", [
    check("ticket")
        .not()
        .isEmpty().withMessage("CAS ticket required."),
], async (req, res) => {

    const ticket = req.body['ticket']
    const serviceHost = encodeURI(process.env.SERVICE_HOST)
    const url = process.env.CAS_HOST + "serviceValidate?ticket=" + ticket + "&service=" + serviceHost + "ticket"

    authService.loginOrRegister(url)
        .then(data => statusResponse.ok(res, data))
        .catch( _ => statusResponse.badRequest(res))


})

module.exports = router;