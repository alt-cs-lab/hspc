import ServiceUtils from "../../_utilities/serviceUtils";

class RequestService {
  /*
   * Calls the API and returns a JSON list of all advisors' school requests.
   */
  getAllSchoolRequests() {
    return ServiceUtils.getRequest("/api/request/allSchool", {});
  }

  /*
   * Calls the API and approves or denies a specific advisor's school request.
   */
  completeSchoolRequest(approved, schoolid, advisorid) {
    return ServiceUtils.postRequest("/api/request/completeSchool", {
      approved: approved,
      schoolid: schoolid,
      advisorid: advisorid,
    });
  }

  /*
   * Calls the API to request an additional school for a specific advisor
   */
  requestAdditionalSchool(schoolid, advisorid) {
    return ServiceUtils.postRequest("/api/request/requestSchool", {
      schoolid: schoolid,
      advisorid: advisorid,
    });
  }

  /*
  * Calls the API and returns a JSON list of all teams
  */
  getWaitlistedTeamsForEvent( eventid ) {
    return ServiceUtils.getRequest("/api/request/waitlistedTeamsForEvent", { eventid: eventid });
  }

  /*
  * Calls the API and approves or denies a specific team's waitlisted condition.
  */
  completeWaitlistedTeamRequest(approved, teamid) {
    return ServiceUtils.postRequest("/api/request/completeTeamRegistration", {
      approved: approved,
      teamid: teamid,
    });
  }
}

// TODO TWP: Check if this comment line below is alright
// eslint-disable-next-line
export default new RequestService();
