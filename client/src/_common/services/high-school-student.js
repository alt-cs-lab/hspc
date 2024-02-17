import ServiceUtils from "../../_utilities/serviceUtils";

class StudentService {
    constructor() {
        
    }

    /*
    * API Endpoint adds student to table. creates a student
    *
    */
    addstudent(firstName, lastName, school, email, gradDate) {
        return ServiceUtils.postRequest('api/user/addstudent', {
            firstName: firstName,
            lastName: lastName,
            school: school,
            email: email,
            gradDate: gradDate
        });
    }
}