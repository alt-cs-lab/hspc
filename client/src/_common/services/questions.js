import ServiceUtils from "../../_utilities/serviceUtils";

class QuestionsService {
    constructor() {
        this.getAllquestions = this.getAllQuestions.bind(this);
        this.getTestcasesByID = this.getTestcasesByID.bind(this);
    }

    /*
      * API Endpoint that returns testcases by questionid
      */
    getTestcasesByID(questionid) {
        return ServiceUtils.getRequest('/testcases/gettestcasesbyid', {questionid: questionid});
    }

    /*
    * Calls the API and returns a JSON list of all registered questionss.
    */
    getAllQuestions() {
        return ServiceUtils.postRequest('/questions/view', {});
    }
}

// TODO TWP: Check if this comment line below is alright
// eslint-disable-next-line
export default new QuestionsService();