import ServiceUtils from "../../_utilities/serviceUtils";

class UserService {

  /*
   * Calls the API and returns a JSON list of all registered users.
   */
  getAllUsers() {
    return ServiceUtils.getRequest("/api/user/view", {});
  }

  updateProfile(updateData, userId) {
    return ServiceUtils.postRequest("api/user/updateProfile", {
      updateData: updateData,
      userId: userId,
    })
  }
}

// TODO TWP: Check if this comment line below is alright
// eslint-disable-next-line
export default new UserService();
