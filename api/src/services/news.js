/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
const {db} = require('../utils/hspc_db');
const {renameKeys} = require('../utils/extensions.js');

module.exports = {
    createNews: createNews,
    getNewsHistory: getNewsHistory
};

/**
 * Returns promise that creates a news article.
 * Accepts a request body with the following keys:
 * * title
 * * subheading
 * * body
 * * date
 * @param {Object} reqBody Request body.
 * @returns {Promise} Promise that resolves to a news article.
 */
function createNews({title, subheading, body, date}) {
    return db.none(`INSERT INTO Article (ArticleTitle, ArticleSubHeading, ArticleMessage, ArticleDate)
            VALUES( $(title), $(subheading), $(body), $(date))`, 
            {title, subheading, body, date})
}

/**
 * Get all news articles.
 * @returns {Promise} Promise that resolves to a list of news articles.
 */
function getNewsHistory(){
    return db.any(`SELECT 
                A.ArticleTitle, A.ArticleSubHeading, A.ArticleMessage, A.ArticleDate 
                FROM Article AS A`)
                .then((news) => renameKeys(news,["title", "subheading", "body", "date"]));
}