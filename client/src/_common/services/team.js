import ServiceUtils from "../../_utilities/serviceUtils";

class TeamService {
    constructor() {
    }

    /*
    * Passes team information to the API and registers a new team object in the database.
    * @param {string} text value of the new team's name
    * @param {string} schoolID associated with the team
    * @param {string} compeitionID associated with the team
    * @param {string} question level of the team
    * @param {string} user id of the advisor who the team belongs to
    */
    registerTeam(teamName, schoolId, competitionId, questionLevelId, advisorId) {
        return ServiceUtils.postRequest('/api/team/create', {
            teamName: teamName,
            schoolId: schoolId,
            competitionId: competitionId,
            questionLevelId: questionLevelId,
            advisorId: advisorId
        });
    }

    /*
    * Calls the API and returns a JSON list of all registered teams.
    */
    getAllTeams() {
        return ServiceUtils.getRequest('/api/team/view', {});
    }

    /*
  * Calls the API and returns a JSON list of all registered teams.
  */
    getTeamsNeedingAssignment() {
        return ServiceUtils.getRequest('/api/team/teamsNeedingAssignment', {});
    }


    /*
   * Calls the API and returns a JSON list of all teams for the passed in competition by event date and Team Difficulty .
   */
    getTeamsByDifficulty(eventDate, teamDifficulty) {
        //TODO: put in URL
        return ServiceUtils.getRequest('zzz', {
            eventDate: eventDate,
            teamDifficulty: teamDifficulty
        });
    }


    /*
    * Posts the corresponding student and team in the TeamUsers table, adding a student to a team
    */
    addStudentToTeam(email, teamName) {
        return ServiceUtils.postRequest('/api/team/add', {
            email: email,
            teamName: teamName
        });
    }

    /*
    * Calls the API and returns a JSON list of all teams for the passed in competition by event date.
    */
    getAllTeamsInComp(eventDate) {
        return ServiceUtils.getRequest('/api/team/compTeams', {eventDate: eventDate});
    }

    /*
    * Calls the API and returns a JSON list of all teams for the passed in competition by event name.
    */
    getAllTeamsInCompName(eventName) {
        return ServiceUtils.getRequest('/api/team/teamsEventName', {eventName: eventName});
    }

    /*
    * Gets teams from a school during an event
    */
    getTeamSchoolEvent(schoolid, competitionid) {
        return ServiceUtils.getRequest('/api/team/schoolevent', {
            schoolId: schoolid,
            competitionId: competitionid
        });
    }


    /*
     * Gets Teams from an event
     */
    getTeamsEventID(competitionid) {
        return ServiceUtils.getRequest('/api/team/teamseventid', {competitionId: competitionid});
    }

    /*
    * Calls the API and returns a JSON of the team associated with the passed in id.
    */
    getVolunteerTeam(teamid) {
        return ServiceUtils.getRequest('/api/team/getvolunteerteam', {teamid: teamid});
    };


}

export default new TeamService();