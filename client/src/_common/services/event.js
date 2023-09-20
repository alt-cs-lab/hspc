import ServiceUtils from "../../_utilities/serviceUtils";


class EventService {
    constructor() {
        this.event = null;
    }

    /*
    * Calls the API and registers a new Event object in the database.
        @Edited: Natalie Laughlin - added the event name to be passed in
    * @param {string} text location of the event
    * @param {string} stringified value of the event date
    * @param {string} stringified value of the event time
    * @param {string} number value for teams per school
    * @param {string} text value of the event's description
    */
    createEvent(eventName, eventLocation, eventDate, eventTime, teamsPerSchool, teamsPerEvent, eventDes) {
        return ServiceUtils.postRequest('/api/event/create', {
            eventName: eventName,
            eventLocation: eventLocation,
            eventDate: eventDate,
            eventTime: eventTime,
            teamsPerSchool: teamsPerSchool,
            teamsPerEvent: teamsPerEvent,
            eventDes: eventDes
        });
    }

    /*
    * Calls the API and returns a JSON list of all registered events.
    */
    getAllEvents(userID, accessLevel) {
        return ServiceUtils.getRequest('/api/event/view', {
            userID: userID,
            accessLevel: accessLevel
        });
    }
}

export default new EventService;
