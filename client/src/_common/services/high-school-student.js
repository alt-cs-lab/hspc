import ServiceUtils from "../../_utilities/serviceUtils";

class StudentService {
    constructor() {
        this.addHighSchoolStudent = this.addHighSchoolStudent.bind(this);
    }

    /*
    * API Endpoint adds student to table. creates a student
    */
    addHighSchoolStudent(firstName, lastName, school, email, gradDate) {
        return ServiceUtils.postRequest('api/high-school-student/addHighSchoolStudent', {
            firstName: firstName,
            lastName: lastName,
            school: school,
            email: email,
            gradDate: gradDate
        });
    }
}

export default new StudentService();