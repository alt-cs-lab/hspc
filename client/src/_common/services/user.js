/**
 * Author: Devan Griffin
 * Modified: 4/24/2024
 */

import ServiceUtils from "../../_utilities/serviceUtils";

/**
 * Class for sending requests to the API for users
 */
class UserService {

  /**
   * Requests to get all users
   * @returns {json} All users
   */
  getAllUsers() {
    return ServiceUtils.getRequest("/api/user/view", {});
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
