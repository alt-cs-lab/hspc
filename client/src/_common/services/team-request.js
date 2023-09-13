import ServiceUtils from "../../_utilities/serviceUtils";

//TODO: MOVE THIS TO team.js
class UpgradeTeamService {
    constructor() {
    }

    /*
    * Calls the API and returns a JSON list of all requests for all the unverified teams.
    */
    getAllTeams() {
        return ServiceUtils.getRequest('/teamName/view', {});
    }

    /* NOT FINISHED THIS IS JUST A COPY OF USER REQUEST
    * Calls the API and sets the isVerified value to the value of teamRequestLevel.
    * @param {string} text value of the requesting the teams name
    * @param {string} text value of the requested the teams ID number
    */
    acceptTeam(teamName) {
        //TODO: Complete this????
        return ServiceUtils.postRequest('zzz', {teamName: teamName});
    }


    /*
    * Calls the API to remove the team from the database
    * @param {string} text value of the requesting the teams name
    * @param {string} text value of the requesting the teams ID number
    */
    removeTeam(teamName) {
        return ServiceUtils.deleteRequest('/teamName/remove', {teamName: teamName});
    }
}

export default new UpgradeTeamService();