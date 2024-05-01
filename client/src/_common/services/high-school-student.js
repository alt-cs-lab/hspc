/**
 * Author: Devan Griffin
 * Modified: 4/24/2024
 */

import ServiceUtils from "../../_utilities/serviceUtils";

/**
 * Class for sending requests to the API for students
 */
class StudentService {

    /**
     * Request to add a new student
     * @param {string} firstName 
     * @param {string} lastName 
     * @param {int} schoolId 
     * @param {string} email 
     * @param {string} gradDate Graduation Date
     * @returns {json} The request response
     */
    addHighSchoolStudent(firstName, lastName, schoolId, email, gradDate) {
        return ServiceUtils.postRequest('api/high-school-student/createStudent', { 
            firstName: firstName, 
            lastName: lastName, 
            schoolId: schoolId,
            email: email, 
            gradDate: gradDate
        });
    }

    /**
     * Request to edit a student
     * @param {int} studentId 
     * @param {string} firstName 
     * @param {string} lastName 
     * @param {int} schoolId 
     * @param {string} gradDate Graduation Date
     * @returns {json} The request response
     */
    editHighSchoolStudent(studentId, firstName, lastName, schoolId, gradDate) {
        return ServiceUtils.postRequest('api/high-school-student/editStudent', { 
            studentId: studentId,
            firstName: firstName, 
            lastName: lastName, 
            schoolId: schoolId,
            gradDate: gradDate
        });
    }

    /**
     * Request to get all students
     * @returns {json} All students
     */
    getAllStudents() {
        return ServiceUtils.getRequest('api/high-school-student/getAllStudents');
    }

    /**
     * Request to get all the students at a specific school who aren't in a team.
     * @param {int} schoolId 
     * @returns {json} The students without a team
     */
    getStudentsWithNoTeam(schoolId) {
        return ServiceUtils.getRequest('api/high-school-student/getStudentsWithNoTeam', {
            schoolId: schoolId
        });
    }

    /**
     * Request to get all the students for an advisor
     * @param {int} advisorId
     * @returns {json} The advisor's students
     */
    getAdvisorsStudents(advisorId) {
        return ServiceUtils.getRequest('api/high-school-student/getFromAdvisorSchools', {
            advisorId: advisorId
        });
    };


    //TODO TWP: MOVE TO STUDENT SERVICE
    /**
     * Request to get all students based off a team 
     * @param {int} teamid 
     * @returns {json} All the students in the team
     */
    getStudentsInTeam(teamid) {
        return ServiceUtils.getRequest("api/high-school-student/teamStudents", { teamid: teamid });
    }
}

// TODO TWP: Check if this comment line below is alright
// eslint-disable-next-line
export default new StudentService();