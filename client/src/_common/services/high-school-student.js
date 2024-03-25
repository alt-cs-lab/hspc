import ServiceUtils from "../../_utilities/serviceUtils";

class StudentService {

    addHighSchoolStudent(firstName, lastName, schoolId, email, gradDate) {
        return ServiceUtils.postRequest('api/high-school-student/createStudent', { 
            firstName: firstName, 
            lastName: lastName, 
            schoolId: schoolId,
            email: email, 
            gradDate: gradDate
        });
    }

    getAllStudents() {
        return ServiceUtils.getRequest('api/high-school-student/getAllStudents');
    }

    getStudentsWithNoTeam(schoolId) {
        return ServiceUtils.getRequest('api/high-school-student/getStudentsWithNoTeam', {
            schoolId: schoolId
        });
    }

    /*
    * API Endpoint retrieves all students from an advisor's schools
    */
    getAdvisorsStudents(advisorId) {
        return ServiceUtils.getRequest('api/high-school-student/getFromAdvisorSchools', {
            advisorId: advisorId
        });
    };

    /*
    * API Endpoint that returns all users with Student based on team name
    * TODO TWP: MOVE TO STUDENT SERVICE
    */
    getStudentsInTeam(competitionid, teamName) {
        return ServiceUtils.getRequest("api/high-school-student/teamStudents", { competitionid: competitionid, teamName: teamName });
    }
}

// TODO TWP: Check if this comment line below is alright
// eslint-disable-next-line
export default new StudentService();