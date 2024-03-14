/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
const router = require('express').Router();
const newsService = require('../services/news');
const passport = require('passport');
const { accessLevelCheck, badRequestCheck } = require('../utils/extensions.js');
const constants = require('../utils/constants.js');
const { useService } = require('../utils/extensions.js');
const {check} = require('express-validator');

/**
 * @api {post} /api/news/create Create news article
 * @apiName CreateNews
 * @apiGroup News
 * @apiDescription Creates a news article.
 * 
 * @apiBody {String} [title] Title of the news article.
 * @apiBody {String} subheading subheading of the news article.
 * @apiBody {String} [body] Body of the news article.
 * @apiBody {String} [date] Date of the news article.
 * 
 * @apiSuccess (Success 200) {Number} success HTTP status code indicating success
 *
 * @apiError {Number} 401 Unauthorized
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       Unauthorized
 *     }
 *
 * @apiError {Number} 500 Internal Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Internal Server Error"
 *     }
 */
router.post('/create', 
    passport.authenticate('jwt', { session: false }),
    accessLevelCheck(constants.ADMIN), 
    [check('title').isString().withMessage('title is required'), 
    check('body').isString().withMessage('body is required'), 
    check('date').isString().withMessage('date is required')],
    badRequestCheck,
    (req, res) => {
        useService(newsService.createNews, req, res);
});

/**
 * @api {get} /api/news/view Request news articles
 * @apiName ViewNews
 * @apiGroup News
 * @apiDescription Retrieves all news articles.
 *
 * @apiSuccess {List} List of news articles.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  [
 *      {
 *          "title": "Work being done",
 *          "subheading": "Please do not disturb the engineers",
 *          "body": "Goodbye!",
 *          "date": "2022-2-18"
 *      },
 *  ]
 * 
 *
 */
router.get('/view', (req, res) => {
    useService(newsService.getNewsHistory, req, res);
});

module.exports = router;