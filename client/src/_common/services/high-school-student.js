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

    editHighSchoolStudent(studentId, firstName, lastName, schoolId, gradDate) {
        return ServiceUtils.postRequest('api/high-school-student/editStudent', { 
            studentId: studentId,
            firstName: firstName, 
            lastName: lastName, 
            schoolId: schoolId,
            gradDate: gradDate
        });
    }

    editStudentEmail(studentId, email, firstName, lastName, schoolId, gradDate) {
        return ServiceUtils.postRequest('api/high-school-student/editStudentEmail', { 
            studentId: studentId,
            email: email,
            firstName: firstName, 
            lastName: lastName, 
            schoolId: schoolId,
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

    /**
     * Gets all the students for an advisor from the API
     * @param {int} advisorId The advisor's id
     * @returns {json} A json of all the students 
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
    getStudentsInTeam(teamid) {
        return ServiceUtils.getRequest("api/high-school-student/teamStudents", { teamid: teamid });
    }
}

// TODO TWP: Check if this comment line below is alright
// eslint-disable-next-line
export default new StudentService();