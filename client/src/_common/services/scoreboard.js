import ServiceUtils from "../../_utilities/serviceUtils";

class ScoreboardService {
    constructor() {
        this.scoreboard = null

    }

    /*
        * Calls the API and registers a new scoreboard object in the database.
        * @param {string} text location of the event
        * @param {string} stringified value of the event date
        * @param {string} stringified value of the event time
        * @param {string} number value for teams per school
        * @param {string} text value of the event's description
        */
    createEvent(eventDate, teamid) {
        return ServiceUtils.postRequest('/scoreboard/create', {
            eventDate: eventDate,
            teamid: teamid
        });
    }

    /*
       * Calls the API and returns a JSON list of all correct answers
       */
    getteamscore(teamName) {
        return ServiceUtils.getRequest('/scoreboard/getteamscore', {teamName: teamName});
    }

    /*
        * Calls the API and returns a JSON list of all wrong answers
        */
    getteamwrong(teamName) {
        return ServiceUtils.getRequest('/scoreboard/getteamwrong', {teamName: teamName});
    }

    /*
     * Calls the API and returns a JSON list of all registered scoreboards.
     */
    getAllScoreBoard(eventDate) {
        return ServiceUtils.getRequest('/scoreboard/view', {eventDate: eventDate});
    }

    /*
        * Calls the API and returns a JSON list of all registered  questions for a given event.
        */
    getQuesitons(eventDate) {
        return ServiceUtils.getRequest('/scoreboard/getquestions', {eventDate: eventDate});
    }
}

export default new ScoreboardService();