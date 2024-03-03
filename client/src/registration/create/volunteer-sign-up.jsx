/*
MIT License
Copyright (c) 2024 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import StatusMessages from "../../_common/components/status-messages/status-messages.jsx";
// import Button from 'react-bootstrap/Button';
// import SchoolService from "../../_common/services/school.js";
import "../../_common/assets/css/register-user.css";
// import StudentService from "../../_common/services/high-school-student.js";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";
// import { Form } from "react-bootstrap";
// import BaseSelect from "react-select";
// import FixRequiredSelect from "./FixRequiredSelect.jsx";
// import SchoolService from "../../_common/services/school.js";

// const selectStyles = {
//   menu: (base) => ({
//     ...base,
//     zIndex: 100
//   }),
// };

/*
 * @author: Trent Powell
 * Class that handles the client side addition of a school to an advisor. Associating an advisor with a school
 */
class VolunteerSignUp extends Component {
  constructor(props) {
    super(props);
    this.volunteer = this.props.auth.user;
    this.state = {
      competitionList: []
    };
  }

  // On Component Load, Populate the event dropdown with all upcoming events and default to the most upcoming event.
  componentDidMount = () => {
    /*SchoolService.getAdvisorSchools(this.advisor.id)
    .then((response) => {
        if (response.ok) {
            let schoolbody = response.data;
            let schools = [];
            for (let i = 0; i < schoolbody.length; i++) {
                schools.push({
                    label: schoolbody[i].schoolname,
                    value: schoolbody[i].schoolid,
                });
            }
            this.setState({ schoolList: schools });
        } else console.log("An error has occurred, Please try again.");
    })
    .catch((resErr) => console.log("Something went wrong. Please try again"));*/
  };

  submitSignup(event) {
    //const newStudent = this.state;
    //const gradDate = this.toDate(newStudent.gradYear, newStudent.gradMonth, 28);
    //StudentService.addHighSchoolStudent(newStudent.firstName, newStudent.lastName, newStudent.schoolId, newStudent.email, gradDate);
  }

  /*
   * Renders the form to be filled out for creating/registering a school
   * Uses same elements as previous forms
   */
  render() {
    return (
      <div className="signupBox">
        <StatusMessages/>
        <h2>Sign Up To Volunteer</h2>
        <div>
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
