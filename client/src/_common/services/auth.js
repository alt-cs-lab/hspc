import jwtDecode from "jwt-decode";
import ServiceUtils from "../../_utilities/serviceUtils";

class AuthService {
    constructor() {
        this.authenticatedUser = null;
    }

    /*
    * Calls the API and registers a new user object in the database.
    * @param {string} text value of the user's team name 
    * @param {string} text value of the user's first name (required)
    * @param {string} text value of the user's lastName (required)
    * @param {string} text value of the user's email (required)
    * @param {string} text value of the user's phone number
    * @param {string} plain text value of the user's password
    * @param {string} numerical value of the user's access level (required)
    * @param {string} numerical value of the user;s requested permission level 
    */
    register(teamName, firstName, lastName, email, phone, password, accessLevel, requestLevel) {
        return ServiceUtils.postRequest('/user/register', {
            teamName: teamName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            password: password,
            accessLevel: accessLevel,
            requestLevel: requestLevel
        });
    }

    /*
    * Calls the API and registers a new Event object in the database.
    * @param {string} email string from the user login page.
    * @param {string} plain text password from the user login page.
    */
    login(email, password) {
        return ServiceUtils.postRequest('api/auth/login', {
            email: email,
            password: password
        }).then((response) => {
            if (response.status === 200 && response.data.success) {
                localStorage.setItem("jwtToken", response.data.token)
                return jwtDecode(response.data.token)
            }
            else {
                throw new Error(response.data?.msg || "Login failed.");
            }
        });
    }


    // TODO: revoke token from api.
    logout() {
        localStorage.removeItem("jwtToken")
    }
}

export default new AuthService();