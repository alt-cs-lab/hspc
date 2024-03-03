import ServiceUtils from "../../_utilities/serviceUtils";
import { updateErrorMsg } from "../../_store/slices/errorSlice";
import axios from "axios";

export const addHighSchoolStudent = (firstName, lastName, schoolId, email, gradDate, router) => dispatch => {
    axios.post('api/high-school-student/createStudent', { firstName: firstName, lastName: lastName, schoolId: schoolId,
            email: email, gradDate: gradDate})
        .then(res => { router.navigate("/advisor/advisordash"); }) // re-direct to login on successful register
        .catch(err => {
            console.log("register catch", err.response.data);
            dispatch(updateErrorMsg(err.response.data))
        });
};

class StudentService {

    /*
    * API Endpoint retrieves all students from an advisor's schools
    */
    getAdvisorsStudents(advisorId) {
        return ServiceUtils.getRequest('api/high-school-student/getFromAdvisorSchools', {
            advisorId: advisorId
        });
    };
}

// TODO TWP: Check if this comment line below is alright
// eslint-disable-next-line
export default new StudentService();