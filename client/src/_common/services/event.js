import ServiceUtils from "../../_utilities/serviceUtils";


class EventService {

    /*
    * Calls the API and registers a new Event object in the database.
    */
    createEvent(eventName, eventLocation, eventDate, startTime, endTime, teamsPerEvent, beginnerTeamsPerEvent, advancedTeamsPerEvent, teamsPerSchool, beginnerTeamsPerSchool, advancedTeamsPerSchool, description) {  
        return ServiceUtils.postRequest('/api/event/create',{
            name: eventName,
            location: eventLocation,
            date: eventDate,
            startTime: startTime,
            endTime: endTime,
            beginnerTeamsPerSchool: beginnerTeamsPerSchool,
            advancedTeamsPerSchool: advancedTeamsPerSchool,
            teamsPerSchool: teamsPerSchool,
            beginnerTeamsPerEvent: beginnerTeamsPerEvent,
            advancedTeamsPerEvent: advancedTeamsPerEvent,
            teamsPerEvent: teamsPerEvent,
            description: description});
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

    /*
    * Calls the API and returns the most upcoming event or if there are none, the most recent.
    */
    getHighlightEvent() {
        return ServiceUtils.getRequest('/api/event/highlightEvent');
    }
}

// TODO TWP: Check if this comment line below is alright
// eslint-disable-next-line
export default new EventService;
