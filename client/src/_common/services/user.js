import ServiceUtils from "../../_utilities/serviceUtils";

class UserService {
    constructor() {
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getAllVolunteers = this.getAllVolunteers.bind(this);
        this.logVolunteerAssignment = this.logVolunteerAssignment.bind(this);
        this.getAllStudents = this.getAllStudents.bind(this); //????
        this.getAllAdvisors = this.getAllAdvisors.bind(this);
        this.addstudent = this.addstudent.bind(this);//Natalie Laughlin
        this.getStudentsFromAdvisors = this.getStudentsFromAdvisors.bind(this);//Natalie Laughlin
        this.getstudentsteam = this.getstudentsteam.bind(this);//Natalie Laughlin
        this.addadvisor = this.addadvisor.bind(this);
    }

    /*
    * Calls the API and returns a JSON list of all registered users.
    */
    getAllUsers() {
        return ServiceUtils.getRequest('/user/view', {});
    }

    getAllVolunteers() {
        return ServiceUtils.getRequest('/user/volunteers', {});
    };

    getActiveVolunteers() {
        return ServiceUtils.getRequest('/user/activevolunteers', {});
    }

    /*
     * API Endpoint that returns all volunteers currently assigned to teams
     */
    getAllVolunteerAssignments() {
        return ServiceUtils.getRequest('/user/getallvolunteerassignments', {});
    }

    /*
     * API Endpoint that returns all teams that have been assigned a volunteer
     */
    getAllTeamAssignments() {
        return ServiceUtils.getRequest('/user/getallteamassignments', {});
    }

    /*
    * API Endpoint that returns all users with Advisor access.
    */
    getAllAdvisors() {
        return ServiceUtils.getRequest('/user/advisors', {});
    };

    /*
       * API Endpoint that returns all users with Student access.
       *
       */
    getAllStudents() {
        return ServiceUtils.getRequest('/user/students', {});
    };


    /*
       * API Endpoint that returns all users with Student based on the advisor.
       *
       * @author: Trent Kempker
       * @edited: Natalie Laughlin - passes in the email
       *
       * modified to get the users assiated with an advisor Natalie Laughlin
       */
    getStudentsFromAdvisors(email) {
        return ServiceUtils.getRequest('/user/studentsAvisor', {email: email});
    };

    /*
     * API Endpoint that returns all users with Student based on team name
     */
    getstudentsteam(teamName) {
        return ServiceUtils.getRequest('/user/viewteam', {teamName: teamName});
    };


    /*
    * API Endpoint adds student to table. creates a student
    *
    */
    addstudent(firstName, lastName, email, phone, accesslevel, requestlevel, hashedPassword, advisoremail) {
        return ServiceUtils.postRequest('/user/addstudent', {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            password: hashedPassword,
            accessLevel: accesslevel,
            requestLevel: requestlevel,
            advisoremail: advisoremail,
        });
    }

    /*
    * API Endpoint adds student to table. creates an advisor
    *
    * @author: Natalie Laughlin - formate taken from other method authored by Trent Kempker
    */
    addadvisor(firstName, lastName, email, phone, accesslevel, requestlevel, hashedPassword, schoolname) {

        return ServiceUtils.postRequest('/user/addadvisor', {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            password: hashedPassword,
            accessLevel: accesslevel,
            requestLevel: requestlevel,
            schoolname: schoolname,
        });
    }

    /*
    * API Endpoint that upates Adivsors table with schoolID
    *

    */
    updateAdvisorSchool(userId, schoolId) {
        return ServiceUtils.postRequest('/user/addschool', {
            userId: userId,
            schoolId: schoolId
        });
    }

    /*
    *API Endpoint that sets a volunteer as active in the database
    */
    checkInVolunteer(userId) {
        return ServiceUtils.postRequest('/user/checkinvolunteer', {
            userId: userId
        });
    }

    /*
    *API Endpoint that checks out a volunteer
    */
    checkOutVolunteer(userId) {
        return ServiceUtils.postRequest('/user/checkoutvolunteer', {
            userId: userId
        });
    }

    /*
    * API Endpoint that logs a volunteer assignment
    *
    * @author: Trey Moddelmog
    * @param {string} text value of the competition/event ID
    * @param {string} text value of the user ID
    * @param {string} text value of the team ID
    */
    logVolunteerAssignment(compID, volID, teamID) {
        return ServiceUtils.postRequest('/user/assignment', {
            compID: compID,
            volID: volID,
            teamID: teamID
        });
    }

    /*
    * Calls the API, registers a new user object, and assigns the user to teamName
    * @param {string} text value of the team name the user is being added to
    * @param {string} text value of the first name of the new user
    * @param {string} text value of the last name of the new user
    * @param {string} text value of the email address of the new user
    * @param {string} text value of the access level given to the new user
    * @param {string} encrypted text value of the new user's password
    */
    addUser(teamName, firstName, lastName, email, phone, accesslevel, hashedPassword) {
        return ServiceUtils.postRequest('/user/create', {
            teamName: teamName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            password: hashedPassword,
            accessLevel: accesslevel,
        });
    }


    /*
        * API Endpoint that returns the volunteer team for the current user.
        *
        * @author: Trent Kempker
        */
    getVolunteerAssignment(volunteerid) {
        return ServiceUtils.postRequest('/user/getvolunteerassignment', {
            volunteerid: volunteerid
        });
    };

    /*
    * API Endpoint that returns the volunteer assigned for the current team selected.
    *
    * @author: May Phyo 
    */
    getTeamAssignment(teamid) {
        return ServiceUtils.getRequest('/user/getteamassignment', {
            teamid: teamid
        });
    };

    /*
    * API Endpoint that deletes the assignment based on volunteeid
    */
    removeAssignment(volunteerid) {
        return ServiceUtils.deleteRequest('/user/removeassignment', {
            volunteerid: volunteerid
        });
    }
}

export default new UserService();