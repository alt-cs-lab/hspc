import ServiceUtils from "../../_utilities/serviceUtils";

class TeamService {

    /*
    * Passes team information to the API and registers a new team object in the database.
    * @param {string} text value of the new team's name
    * @param {string} schoolID associated with the team
    * @param {string} compeitionID associated with the team
    * @param {string} question level of the team
    * @param {string} user id of the advisor who the team belongs to
    */
    registerTeam(teamName, schoolId, competitionId, skillLevelId, advisorId, studentIds, waitlisted) {
        return ServiceUtils.postRequest('/api/team/create', {
            teamName: teamName,
            schoolId: schoolId,
            competitionId: competitionId,
            skillLevelId: skillLevelId,
            advisorId: advisorId,
            studentIds: studentIds,
            waitlisted: waitlisted
        });
    }

    /*
    * Calls the API and returns a JSON list of all registered teams.
    */
    getAllTeams() {
        return ServiceUtils.getRequest('/api/team/view', {});
    }

    /*
    * Calls the API and returns a JSON list of all skill levels.
    */
    getAllSkillLevels(){
        return ServiceUtils.getRequest('/api/team/levels', {});
    }

    /*
    * Calls the API and returns a JSON list of all teams for the passed in competition by event date.
    */
    getAllTeamsInComp(eventDate) {
        return ServiceUtils.getRequest('/api/team/compTeams', {eventDate: eventDate});
    }

    /*
    * Gets Teams from an advisor's schools
    */
    getAdvisorsTeams(advisorId) {
        return ServiceUtils.getRequest('/api/team/getFromAdvisorSchools', {
            advisorId: advisorId,
        });
    }
        
    /*
    * Calls the API and returns a JSON of the teams registered for a competition.
    */
    getTeamsInCompetition(competitionid) {
        return ServiceUtils.getRequest('/api/team/getTeamsInCompetition', {competitionid: competitionid});
    };

    /*
    * Calls the API and returns a JSON of the teams registered for a competition for all schools.
    */
    getTeamsInCompetitionForAllSchools(competitionid) {
        return ServiceUtils.getRequest('/api/team/getTeamsInCompetitionForAllSchools', {competitionid: competitionid});
    };

    /*
    * Calls the API and returns a JSON of the details of a team.
    */
    getTeamDetails(teamid) {
        return ServiceUtils.getRequest('/api/team/getTeamDetails', {teamid: teamid});
    };
}

// TODO TWP: Check if this comment line below is alright
// eslint-disable-next-line
export default new TeamService();