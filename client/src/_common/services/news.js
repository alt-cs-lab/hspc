import ServiceUtils from "../../_utilities/serviceUtils";

class NewsService {
    constructor() {
        this.news = null;
    }

    /*
    * Creates a new newsletter update to be displayed on the homescreen.
    * @param {string} text value of the article's heading
    * @param {string} text value of the article's subheaging
    * @param {string} text value of the article's message
    * @param {string} stringified value of the articles publish date
    */
    createNews(articleTitle, articleSubHeading, articleBody, articleDate) {
        return ServiceUtils.postRequest('/news/create', {
            articleTitle: articleTitle,
            articleSubHeading: articleSubHeading,
            articleBody: articleBody,
            articleDate: articleDate
        });
    }

    /*
    * Returns all news events in chronological order
    */
    getNewsHistory() {
        return ServiceUtils.getRequest('/news/view', {});
    }
}

export default new NewsService();