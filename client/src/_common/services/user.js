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
    }

    /*
    * Calls the API and returns a JSON list of all registered users.
    */
    getAllUsers() {
        return ServiceUtils.getRequest('api/user/view', {});
    }

    getAllVolunteers() {
        return ServiceUtils.getRequest('api/user/volunteers', {});
    };

    getActiveVolunteers() {
        return ServiceUtils.getRequest('api/user/activevolunteers', {});
    }

  /*
   * API Endpoint that returns all volunteers currently assigned to teams
   */
  getAllVolunteerAssignments() {
    return ServiceUtils.getRequest("api/user/getallvolunteerassignments", {});
  }

  /*
   * API Endpoint that returns all teams that have been assigned a volunteer
   */
  getAllTeamAssignments() {
    return ServiceUtils.getRequest("api/user/getallteamassignments", {});
  }

  /*
   * API Endpoint that returns all users with Advisor access.
   */
  getAllAdvisors() {
    return ServiceUtils.getRequest("api/user/advisors", {});
  }

  /*
   * API Endpoint that returns all users with Student access.
   *
   */
  getAllStudents(email, accessLevel) {
    return ServiceUtils.getRequest("api/user/students", { email: email, accessLevel: accessLevel });
  }

  /*
   * API Endpoint that returns all users with Student based on the advisor.
   *
   * @author: Trent Kempker
   * @edited: Natalie Laughlin - passes in the email
   *
   * modified to get the users assiated with an advisor Natalie Laughlin
   */
  getStudentsFromAdvisors(email) {
    return ServiceUtils.getRequest("api/user/studentsAvisor", { email: email });
  }

  /*
   * API Endpoint that returns all users with Student based on team name
   */
  getstudentsteam(teamName) {
    return ServiceUtils.getRequest("api/user/viewteam", { teamName: teamName });
  }

    /*
    * API Endpoint adds student to table. creates a student
    *
    */
    addstudent(firstName, lastName, email, phone, accesslevel, requestlevel, hashedPassword, advisoremail) {
        return ServiceUtils.postRequest('api/user/addstudent', {
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
    * API Endpoint that upates Adivsors table with schoolID
    *

    */
  updateAdvisorSchool(userId, schoolId) {
    return ServiceUtils.postRequest("api/user/addschool", {
      userId: userId,
      schoolId: schoolId,
    });
  }

  /*
   *API Endpoint that sets a volunteer as active in the database
   */
  checkInVolunteer(userId) {
    return ServiceUtils.postRequest("api/user/checkinvolunteer", {
      userId: userId,
    });
  }

  /*
   *API Endpoint that checks out a volunteer
   */
  checkOutVolunteer(userId) {
    return ServiceUtils.postRequest("api/user/checkoutvolunteer", {
      userId: userId,
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
    return ServiceUtils.postRequest("api/user/assignment", {
      compID: compID,
      volID: volID,
      teamID: teamID,
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
  addUser(
    teamName,
    firstName,
    lastName,
    email,
    phone,
    accesslevel,
    hashedPassword
  ) {
    return ServiceUtils.postRequest("api/user/create", {
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
    return ServiceUtils.postRequest("api/user/getvolunteerassignment", {
      volunteerid: volunteerid,
    });
  }

  /*
   * API Endpoint that returns the volunteer assigned for the current team selected.
   *
   * @author: May Phyo
   */
  getTeamAssignment(teamid) {
    return ServiceUtils.getRequest("api/user/getteamassignment", {
      teamid: teamid,
    });
  }

  /*
   * API Endpoint that deletes the assignment based on volunteeid
   */
  removeAssignment(volunteerid) {
    return ServiceUtils.deleteRequest("api/user/removeassignment", {
      volunteerid: volunteerid,
    });
  }
}

// TODO TWP: Check if this comment line below is alright
// eslint-disable-next-line
export default new UserService();
