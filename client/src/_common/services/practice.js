import ServiceUtils from "../../_utilities/serviceUtils";


class PracticeService {
    constructor() {
    }

    /*
    * Calls the API and adds a new file of practice problems into the database.
    * @param {file} multipart data from the uploaded practice problem file
    */
    addPractice(practice) {
        let data = new FormData();
        data.append('practice', practice);
        return ServiceUtils.postRequest('/practice/create', data);
    }

    /*
    * Calls the API and returns a JSON list of all published practice problems.
    */
    getAllPractice() {
        return ServiceUtils.getRequest('/practice/view', {});
    }
}

export default new PracticeService();