import ServiceUtils from "../../_utilities/serviceUtils";

/*
* Schoolservice class that allows for registration of new schools or viewing of all schools
* Bridges gap between client and API
*/
class SchoolService {
    constructor() {
        this.schools = null;
    }

    /*
    * Passes team information to the API and registers a new team object in the database.
    * @param {string} text value of the school's name
    * @param {string} address line 1 of the school
    * @param {string} address line 2 of the school
    * @param {string} city the school is in
    * @param {string} state code of the school's address
    * @param {string} postal/zip code of the school's address
    * @param {string} USD code of the school
    */
    registerSchool(schoolName, addressLine1, addressLine2, city, state, postalCode, usdCode) {
        return ServiceUtils.postRequest('/api/school/create', {
            schoolName: schoolName,
            addressLine1: addressLine1,
            addressline2: addressLine2,
            city: city,
            state: state,
            postalCode: postalCode,
            usdCode: usdCode
        });
    }

    /*
    * Calls the API and returns a JSON list of all registered schools.
    */
    getAllSchools() {
        return ServiceUtils.getRequest('/api/school/view', {});
    }

}

export default new SchoolService();