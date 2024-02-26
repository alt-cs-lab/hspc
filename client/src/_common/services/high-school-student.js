import ServiceUtils from "../../_utilities/serviceUtils";

class StudentService {
    constructor() {
        this.addHighSchoolStudent = this.addHighSchoolStudent.bind(this);
    }

    /*
    * API Endpoint adds student to table. creates a student
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
}

export default new StudentService();