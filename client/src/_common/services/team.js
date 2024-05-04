import ServiceUtils from "../../_utilities/serviceUtils";

/**
 * TeamService class allows for the creataion of teams and handles all team related information.
 */
class TeamService {
    /**
    * Passes team information to the API and registers a new team object in the database.
    * @param {string} teamName Name of the team.
    * @param {int} schoolId The school that the team is a part of.
    * @param {int} compeitionID The competition to register for.
    * @param {string} skillLevelId Skill level of the team.
    * @param {string} advisorId The ID of the advisor for the team.
    * @param {int[]} studentIds Array of student IDs who will be members of the team.
    * @param {boolean} waitlisted Determines if the team is waitlisted or not. 
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

    /**
    * Calls the API and returns a JSON list of all registered teams.
    */
    getAllTeams() {
        return ServiceUtils.getRequest('/api/team/view', {});
    }

    /**
    * Calls the API and returns a JSON list of all skill levels.
    */
    getAllSkillLevels(){
        return ServiceUtils.getRequest('/api/team/levels', {});
    }

   /**
    * Calls the API and returns a JSON list of all teams for the passed in competition by event date.
    * @param {Date} eventDate The date of the event.
    */
    getAllTeamsInComp(eventDate) {
        return ServiceUtils.getRequest('/api/team/compTeams', {eventDate: eventDate});
    }

    /**
    * Gets Teams from an advisor's schools
    * @param {int} advisorId The ID of the advisor.
    */
    getAdvisorsTeams(advisorId) {
        return ServiceUtils.getRequest('/api/team/getFromAdvisorSchools', {
            advisorId: advisorId,
        });
    }
        
    /**
    * Calls the API and returns a JSON of the teams registered for a competition.
    * @param {int} competitionid ID of the competition to search.
    */
    getTeamsInCompetition(competitionid) {
        return ServiceUtils.getRequest('/api/team/getTeamsInCompetition', {competitionid: competitionid});
    };

    /**
    * Calls the API and returns a JSON of the teams registered for a competition for all schools.
    * @param {int} competitionid ID of the competition to search.
    */
    getTeamsInCompetitionForAllSchools(competitionid) {
        return ServiceUtils.getRequest('/api/team/getTeamsInCompetitionForAllSchools', {competitionid: competitionid});
    };

    /**
    * Calls the API and returns a JSON of the details of a team.
    * @param {int} teamid The ID of the team to be searched.
    */
    getTeamDetails(teamid) {
        return ServiceUtils.getRequest('/api/team/getTeamDetails', {teamid: teamid});
    };
}

export default new TeamService();