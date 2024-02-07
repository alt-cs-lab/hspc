import ServiceUtils from "../../_utilities/serviceUtils";

/**
 * Wrapper for API calls about news
 */
class NewsService {
    constructor() {
        this.news = null;
    }

    /*
    * Creates a new newsletter update to be displayed on the homescreen. OUTDATED
    * @param {string} text value of the article's heading
    * @param {string} text value of the article's subheaging
    * @param {string} text value of the article's message
    * @param {string} stringified value of the articles publish date
    */
    createNews(articleTitle, articleSubHeading, articleBody, articleDate) {
        return ServiceUtils.postRequest('api/news/create', {
            articleTitle: articleTitle,
            articleSubHeading: articleSubHeading,
            articleBody: articleBody,
            articleDate: articleDate
        });
    }

    /**
     * Request to API for a list of news articles
     * @returns A promise containing a json of news articles
     */
    getNewsHistory() {
        return ServiceUtils.getRequest('api/news/view', {});
    }
}

export default new NewsService();