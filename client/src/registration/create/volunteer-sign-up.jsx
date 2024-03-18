/*
MIT License
Copyright (c) 2024 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import EventService from "../../_common/services/event"
// import Button from 'react-bootstrap/Button';
// import SchoolService from "../../_common/services/school.js";
import "../../_common/assets/css/register-user.css";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";
import Button from "react-bootstrap/Button";
import { Form } from "react-bootstrap";
import BaseSelect from "react-select";
import FixRequiredSelect from "../../_common/components/FixRequiredSelect";

const selectStyles = {
  menu: (base) => ({
    ...base,
    zIndex: 100
  }),
};

/*
 * @author: Trent Powell
 * Class that handles the client side addition of a school to an advisor. Associating an advisor with a school
 */
class VolunteerSignUp extends Component {
  constructor(props) {
    super(props);
    this.volunteer = this.props.auth.user;
    this.state = {
      competitionid: null,
      eventList: [],
      timeList: [],
    };
  }

  // On Component Load, Populate the event dropdown with all upcoming events and default to the most upcoming event.
  componentDidMount = () => {
    EventService.getAllEvents()
    .then((response) => {
        if (response.ok){
          let eventData = response.data;
          let events = [];
          for (let i=0; i < eventData.length; i++){
              events.push({
                  label: eventData[i].name,
                  value: eventData[i].id,
                  startTime: eventData[i].startTime,
                  endTime: eventData[i].endTime,
              })
          }
          this.setState({eventList: events});
        } else console.log("An error has occured fetching the events. Please try again");
    })
    .catch((resErr) => console.log("Something went wrong connecting to the server. Please try again."));
  };

  submitSignup(event) {
    //const newStudent = this.state;
    //const gradDate = this.toDate(newStudent.gradYear, newStudent.gradMonth, 28);
    //StudentService.addHighSchoolStudent(newStudent.firstName, newStudent.lastName, newStudent.schoolId, newStudent.email, gradDate);
  }

  updateCompetition(target) {
    this.setState({competitionid: target.value});
    var startTime = target.startTime.split(':');
    var endTime = target.endTime.split(':');

    /*
    * Below is functionality to fill the timeList data based on the competition's start and end time
    * Convert everything to minutes and add 60 to start and finish to account for set up and teardown
    */
    startTime = parseInt(startTime[0])*60 + parseInt(startTime[1]) - 60
    endTime = parseInt(endTime[0])*60 + parseInt(endTime[1]) + 60
    let tempTimeList = [];
    while( startTime < endTime ){
      tempTimeList.push({
        time: startTime,
        selected: false,
        formatted: this.formatTime(startTime)
      })
      startTime += 30;
    }
    this.setState({timeList: tempTimeList})

  }

  formatTime(time){
    var shiftStartTime = {
      hour: parseInt(time/60),
      minute: time%60,
      string: ''
    }
    var shiftEndTime = {
      hour: parseInt((time+30)/60),
      minute: (time+30)%60,
      string: ''
    }

    if(shiftStartTime.minute === 0) shiftStartTime.minute = '00';
    if(shiftEndTime.minute === 0) shiftEndTime.minute = '00';
    if(shiftStartTime.hour > 12) shiftStartTime.string = (shiftStartTime.hour%12) + ':' + shiftStartTime.minute + 'pm';
    else if (shiftStartTime.hour < 0) shiftStartTime.string = (shiftStartTime.hour + 12) + ':' + shiftStartTime.minute + 'pm';
    else if (shiftStartTime.hour === 0) shiftStartTime.string = (12) + ':' + shiftStartTime.minute + 'am';
    else if (shiftStartTime.hour === 12) shiftStartTime.string = (12) + ':' + shiftStartTime.minute + 'pm';
    else shiftStartTime.string = shiftStartTime.hour + ':' + shiftStartTime.minute + 'am';
    if(shiftEndTime.hour > 12) shiftEndTime.string = (shiftEndTime.hour%12) + ':' + shiftEndTime.minute + 'pm';
    else if (shiftEndTime.hour < 0) shiftEndTime.string = (shiftEndTime.hour + 12) + ':' + shiftEndTime.minute + 'pm';
    else if (shiftEndTime.hour === 0) shiftEndTime.string = (shiftEndTime.hour + 12) + ':' + shiftEndTime.minute + 'am';
    else if (shiftEndTime.hour === 12) shiftEndTime.string = (12) + ':' + shiftEndTime.minute + 'pm';
    else shiftEndTime.string = shiftEndTime.hour + ':' + shiftEndTime.minute + 'am';
    
    return shiftStartTime.string + ' - ' + shiftEndTime.string;
  }

  /*
   * Renders the form to be filled out for creating/registering a school
   * Uses same elements as previous forms
   */
  render() {
    return (
      <div className="signupBox">
        <h2>Sign Up To Volunteer</h2>
        <div>
        <Form>

          <Form.Group name="dropdown-div" id="schoolList">
            <Form.Label>Select an Event to Volunteer for:</Form.Label>
            <FixRequiredSelect
              required
              id="dropdown"
              styles={selectStyles}
              placeholder="Select an event"
              options={this.state.eventList}
              onChange={(target) => this.updateCompetition(target)}
              SelectComponent={BaseSelect}
              setValue={this.state.competitionid}
              />
          </Form.Group>
              <Form.Group className="text-start">
                {this.state.timeList.map((timeInterval) => (    
                <Form.Check
                    key={timeInterval.time}
                    type="checkbox"
                    value={timeInterval.time}
                    label={timeInterval.formatted}
                    onChange={() => timeInterval.selected = !timeInterval.selected }
                />
                ))}
              </Form.Group>
              <br/>
              <Button type="register" onClick={(event) => this.submitSignup(event)}>Request To Volunteer</Button>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    errors: state.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchResetErrors: () => dispatch(clearErrors()),
		dispatchError: (message) =>
			dispatch(updateErrorMsg(message)),
		dispatchSuccess: (message) =>
			dispatch(updateSuccessMsg(message))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VolunteerSignUp);
