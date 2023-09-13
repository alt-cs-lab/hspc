/**
 * @fileoverview This file contains the controller for the assignments endpoint.
 * @author Riley Mueller
 * 
 * assignments.js is the controller for the assignments endpoint.
 * The database has VolunteerAssignments and JudgeAssignments. JudgeAssignments belong to a VolunteerAssignment.
 * Volunteers can: request an assignment (they will get a `VolunteerAssignment` but Approved will be 0 (false))
 *                 request a Judge assignment (they will get a `JudgeAssignment`)
 *                 view their assignments (broken down by Event each VolunteerAssignment is for and if it's approved or not)
 *                 unassign themselves from an event (the corresponding `VolunteerAssignment` will be deleted)
 *                 unassign themselves as a Judge from an event (the corresponding `JudgeAssignment` will be deleted)
 * Admins can: approve a volunteer's assignment (the corresponding `VolunteerAssignment` will be updated to Approved = 1 (true))
 *             view all assignments (broken down by Event each VolunteerAssignment is for and if it's approved, if its just Volunteer or Judge assignments)
 *             assign a volunteer to an event (a new `VolunteerAssignment` will be created with Approved = 1 (true))
 *             unassign a volunteer from an event (the corresponding `VolunteerAssignment` will be deleted)
 *             assign a volunteer as a Judge to an event (a new `JudgeAssignment` will be created)
 *             unassign a volunteer as a Judge from an event (the corresponding `JudgeAssignment` will be deleted)
 * Every endpoint must be authenticated and have the appropriate access level.
 * Get requests should use params to filter on what should be returned.
 */

const router = require("express").Router();
const assignmentsService = require("../services/assignments");
const passport = require("passport");
const { minimumAccessLevelCheck, badRequestCheck, useService } = require("../utils/extensions");
const constants = require("../utils/constants");
const { query, body } = require("express-validator");

/**
 * @api {get} /assignments Get assignments
 * @apiName GetAssignments
 * @apiGroup Assignments
 * @apiHeader {String} Authorization Bearer token
 * @apiDescription Get assignments. If no params are provided, all volunteer assignments (for all Volunteers if an admin or just the user if a volunteer) will be returned. Can return based on filter params.
 * @apiParam {Number} [eventId] Filter by eventId
 * @apiParam {Number} [volunteerId] Filter by volunteerId, only admins should be able to use this
 * @apiParam {Boolean} [approved] Filter by approved
 * @apiParam {Boolean} [judgeAssignments] Optional param to instead return JudgeAssignments
 * @apiSuccess (Sucess 200) {Object[]} assignments Array of assignments
 * 
 * @apiSuccessExample {json} Success-Response:
 * [
 *    {
 *        "assignmentId": 1,
 *        "eventId": 1,
 *        "volunteerId": 8,
 *        "approved": true,
 *        "timeAssigned": "2022-11-11T00:21:46.000Z"
 *    },
 *    {
 *        "assignmentId": 2,
 *        "eventId": 1,
 *        "volunteerId": 9,
 *        "approved": true,
 *        "timeAssigned": "2022-11-11T00:21:46.000Z"
 *    },
 *    {
 *        "assignmentId": 3,
 *        "eventId": 2,
 *        "volunteerId": 10,
 *        "approved": false,
 *        "timeAssigned": "2022-11-11T00:21:46.000Z"
 *    }
 * ]
 * 
 * @apiError (Error 400) {String} message Error message
 * @apiError (Error 401) {String} message Error message
 * @apiError (Error 500) {String} message Error message
 *  
 */
router.get('/',
    passport.authenticate('jwt', { session: false }),
    minimumAccessLevelCheck(constants.VOLUNTEER),
    [
        query("eventId").optional().isInt().withMessage("eventId must be an integer"),
        // Only admins can view assignments for other volunteers
        query("volunteerId").custom((value, { req }) => {
            // only admins can view assignments for other volunteers
            if (req.user.accessLevel === constants.VOLUNTEER && req.query.volunteerId && parseInt(req.query.volunteerId) !== req.user.id) {
                throw new Error("volunteerId must be the same as the user's id unless the user is an admin");
            }
            return true;
        }),
        query("volunteerId").optional().isInt().withMessage("volunteerId must be an integer"),
        query("approved").optional().isBoolean().withMessage("approved must be a boolean"),
        query("judgeAssignments").optional().isBoolean().withMessage("judgeAssignments must be a boolean"),
        // there should be no parameters in the body
        body().custom((value, { req }) => {
            if (Object.keys(req.body).length > 0) {
                throw new Error("body must be empty");
            }
            return true;
        })
    ],
    badRequestCheck,
    (req, res) => {
        useService(assignmentsService.get, req, res);
    }
);

/**
 * @api {post} /assignments Assign a volunteer to an event
 * @apiName AssignVolunteer
 * @apiGroup Assignments
 * @apiHeader {String} Authorization Bearer token
 * @apiDescription Assign a volunteer to an event. If the user is an admin, they can assign a volunteer to an event. If the user is a volunteer, they can request to be assigned to an event. If the user is a volunteer and they are requesting to be assigned to an event, they will get a `VolunteerAssignment` but Approved will be 0 (false). If the user is a volunteer and they are requesting to be assigned as a Judge to an event, they will get a `JudgeAssignment` that will also need to be approved. Response will be only indicate if the assignment was successful or not.
 * @apiBody {Number} eventId The eventId to assign the volunteer to
 * @apiBody {Number} [volunteerId] The volunteerId to assign to the event, only admins should be able to use this
 * @apiBody {Number} [teamId] The teamId to assign to the event, indicates this is a JudgeAssignment if present
 * 
 * @apiSuccess (Sucess 200) {Boolean} success Indicates if the assignment was successful or not
 * 
 * @apiError (Error 400) {String} message Error message
 * @apiError (Error 401) {String} message Error message
 * @apiError (Error 409) {String} message Error message indicating there already exists this assignment.
 * @apiError (Error 500) {String} message Error message
 * 
 */
router.post('/',
    passport.authenticate('jwt', { session: false }),
    minimumAccessLevelCheck(constants.VOLUNTEER),
    [
        body("eventId").exists().isInt().withMessage("eventId must be an integer"),
        // only allow volunteerId if the user is an admin
        body("volunteerId").custom((value, { req }) => {
            if (req.user.accessLevel === constants.VOLUNTEER && value) {
                throw new Error("volunteerId must not be provided unless the user is an admin");
            }
            return true;
        }),
        body("volunteerId").optional().isInt().withMessage("volunteerId must be an integer"),
        // volunteerAssignmentId is optional and indicates this is for a JudgeAssignment
        body("volunteerAssignmentId").optional().isInt().withMessage("volunteerAssignmentId must be an integer"),
    ],
    badRequestCheck,
    (req, res) => {
        useService(assignmentsService.create, req, res);
    }
);

/**
 * @api {put} /assignments Approve an assignment
 * @apiName ApproveAssignment
 * @apiGroup Assignments
 * @apiHeader {String} Authorization Bearer token
 * @apiDescription Approve an assignment. Only admins can approve assignments.
 * @apiBody {Number} [volunteerAssignmentId] The volunteerAssignmentId to approve
 * @apiBody {Number} [judgeAssignmentId] The judgeAssignmentId to approve
 * @apiBody {Boolean} approved Indicates if the assignment should be approved or not
 * 
 * @apiSuccess (Sucess 200) {Boolean} success Indicates if the approval was successful or not
 * 
 * @apiError (Error 400) {String} message Error message
 * @apiError (Error 401) {String} message Error message
 * @apiError (Error 500) {String} message Error message
 */
router.put('/',
    passport.authenticate('jwt', { session: false }),
    minimumAccessLevelCheck(constants.ADMIN), // Only admins can approve volunteer assignments
    [
        // the approval can be either for a volunteer assignment or a judge assignment
        body("volunteerAssignmentId").optional().isInt().withMessage("volunteerAssignmentId must be an integer"),
        body("judgeAssignmentId").optional().isInt().withMessage("judgeAssignmentId must be an integer"),
        // must have either a volunteerAssignmentId or a judgeAssignmentId but not both
        body().custom((value, { req }) => {
            if (!req.body.volunteerAssignmentId && !req.body.judgeAssignmentId) {
                throw new Error("Must provide either a volunteerAssignmentId or a judgeAssignmentId");
            }
            if (req.body.volunteerAssignmentId && req.body.judgeAssignmentId) {
                throw new Error("Must provide only of volunteerAssignmentId and judgeAssignmentId, not both");
            }
            return true;
        }),
        body("approved").exists().isBoolean().withMessage("approved must exist and be a boolean"),
    ],
    badRequestCheck,
    (req, res) => {
        useService(assignmentsService.update, req, res);
    }
);

/**
 * @api {delete} /assignments Unassign a volunteer from an event or as a judge
 * @apiName UnassignVolunteer
 * @apiGroup Assignments
 * @apiHeader {String} Authorization Bearer token
 * @apiDescription Unassign a volunteer from an event. If the user is an admin, they can unassign any volunteer from an event. If the user is a volunteer, they can unassign themselves from an event or judge role. Deleting a VolunteerAssignment will also delete any JudgeAssignments associated with it.
 * @apiParam {Number} [volunteerAssignmentId] The assignment to unassign the volunteer from
 * @apiParam {Number} [judgeAssignmentId] The judge assignment to unassign the volunteer from
 * 
 * @apiSuccess (Sucess 200) {Boolean} success Indicates if the unassignment was successful or not, also true if there was no assignment to unassign
 * 
 */
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    minimumAccessLevelCheck(constants.VOLUNTEER),
    [
        // a judge assignment or volunteer assignment must be specified, but not both
        body("judgeAssignmentId").optional().isInt().withMessage("judgeAssignmentId must be an integer"),
        body("volunteerAssignmentId").optional().isInt().withMessage("volunteerAssignmentId must be an integer"),
        body().custom((value, { req }) => {
            if (!req.body.volunteerAssignmentId && !req.body.judgeAssignmentId) {
                throw new Error("Must provide either a volunteerAssignmentId or a judgeAssignmentId");
            }
            if (req.body.volunteerAssignmentId && req.body.judgeAssignmentId) {
                throw new Error("Must provide only of volunteerAssignmentId and judgeAssignmentId, not both");
            }
            return true;
        }),
        // the assignment must exist/belong to the user
        body("volunteerAssignmentId").optional().custom((value, { req }) => {
            // if an admin or above will return all assignments, otherwise will return only the volunteer's assignments
            return assignmentsService.get({ user: req.user }).then((data) => {
                // can we find the assignment from the returned data?
                const assignment = data.find((assignment) => assignment.assignmentId === value);
                if (!assignment) {
                    throw new Error("volunteerAssignmentId must exist and belong to the user unless the user is an admin");
                }
                return true;
            });
        }),
        // the judge assignment must exist/belong to the user
        body("judgeAssignmentId").optional().custom((value, { req }) => {
            return assignmentsService.get({ user: req.user, judgeAssignments: true }).then((data) => {
                // can we find the judge assignment from the returned data?
                const assignment = data.find((assignment) => assignment.judgeAssignmentId === value);
                if (!assignment) {
                    throw new Error("judgeAssignmentId must exist and belong to the user unless the user is an admin");
                }
                return true;
            });
        }),
    ],
    badRequestCheck,
    (req, res) =>  useService(assignmentsService.remove, req, res)
);

module.exports = router;