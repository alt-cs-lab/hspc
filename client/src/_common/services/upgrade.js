import ServiceUtils from "../../_utilities/serviceUtils";

class UpgradeService {
    constructor() {
    }

    /*
    * Calls the API and returns a JSON list of all requests for a higher tier account.
    */
    getAllUpgrades() {
        return ServiceUtils.getRequest('/api/upgrade/view', {});
    }

    /*
    * Calls the API and sets the AccessLevel value to the value of RequestLevel.
    * @param {string} text value of the requesting account's email address
    * @param {string} text value of the requested permission level
    */
    acceptUpgradeRequest(level, email) {
        return ServiceUtils.postRequest('/api/upgrade/edit', {
            email: email,
            requestLevel: level
        });
    }

    /*
    * Calls the API and sets the UserID of AdvisorAffiliation to the
    * UserID of an advisor user
    * 
    * @param {string} email address of the requesting account
    */
    makeAdvisor(email) {
        return ServiceUtils.postRequest('/api/upgrade/advisor', {email: email});
    }

    /*
    * Calls the API and resets the RequestLevel value to the default.
    * @param {string} text value of the requesting account's email address
    */
    removeUpgradeRequest(email) {
        return ServiceUtils.postRequest('/api/upgrade/edit', {email: email});
    }
}

export default new UpgradeService();