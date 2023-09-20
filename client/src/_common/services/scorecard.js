import axios from 'axios';
import ServiceUtils from "../../_utilities/serviceUtils";

class ScorecardService {
    constructor() {
    }

    /*
    * Calls the API and adds the given scorecard file to the database.
    * @param {file} multipart data from the uploaded practice problem file
    */
    addScore(scorecard) {
        let data = new FormData();
        data.append('scorecard', scorecard);
        return ServiceUtils.postRequest('/scorecard/create', data);
    }

    /*
    * Calls the API and returns a JSON list of all published scorecards.
    */
    getAllScores() {
        return ServiceUtils.getRequest('/scorecard/view', {});
    }
}

export default new ScorecardService();