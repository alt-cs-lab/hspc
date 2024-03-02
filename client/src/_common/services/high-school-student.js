// import ServiceUtils from "../../_utilities/serviceUtils";
// import { updateErrorMsg } from "../../_store/slices/errorSlice";

// class StudentService {
//     constructor() {
//         this.addHighSchoolStudent = this.addHighSchoolStudent.bind(this);
//     }

//     /*
//     * API Endpoint adds student to table. creates a student
//     */
//     addHighSchoolStudent = (firstName, lastName, schoolId, email, gradDate, router) => dispatch => {
//         return ServiceUtils.postRequest('api/high-school-student/createStudent', {
//             firstName: firstName,
//             lastName: lastName,
//             schoolId: schoolId,
//             email: email,
//             gradDate: gradDate
//         })
//         .then(res => { router.navigate("/login"); }) // re-direct to login on successful register
//         .catch(err => {
//             console.log("register catch", err.response.data);
//             dispatch(updateErrorMsg(err.response.data))
//         });
//     }
// }

// export default new StudentService();

import axios from "axios";
import { updateErrorMsg } from "../../_store/slices/errorSlice";

export const addHighSchoolStudent = (firstName, lastName, schoolId, email, gradDate, router) => dispatch => {
    axios.post('api/high-school-student/createStudent', { firstName: firstName, lastName: lastName, schoolId: schoolId,
            email: email, gradDate: gradDate})
        .then(res => { router.navigate("/advisor/advisordash"); }) // re-direct to login on successful register
        .catch(err => {
            console.log("register catch", err.response.data);
            dispatch(updateErrorMsg(err.response.data))
        });
};

export const getAllStudents = (schoolId) => {
    axios.get('api/high-school-student/getStudents', { schoolId });
}