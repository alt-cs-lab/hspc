import ServiceUtils from "../../_utilities/serviceUtils";
import axios from 'axios';

class ParticipantService {
    constructor() {
        this.participant = null;
    }

    /*
    * Calls the API and registers a new Event object in the database.
    *
    * @param {string} text value of the team name the participant is being added to
    * @param {string} text value of the participant's school
    * @param {string} two character code representing the prticipant's home state
    * @param {string} text value representing the experience level of the participant
    * @param {string} stringified value of the date of the event that the participant is registering for
    */
    addParticipant(TeamName, SchoolName, StateCode, QuestionLevel, EventDate) {
        axios.post('/participant/create',
            {
                TeamName: TeamName,
                SchoolName: SchoolName,
                StateCode: StateCode,
                EventDate: EventDate,
                QuestionLevel: QuestionLevel
            })
            .then(function (response) {
            })
            .catch(function (err) {
                    console.error(err);
                }
            );
    }

    /*
    * Calls the API and returns a JSON list of all registered events.
    */
    getAllParticipants() {
        axios.post('/participant/view',
            {})
            .then(function (response) {
                if (response.status === 200) {
                    this.events = response.data; // saves the request response.
                }
            })
            .catch(function (err) {
                    console.error(err);
                }
            );
    }
}

export default new ParticipantService();