/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import StatusMessages from "../../_common/components/status-messages/status-messages";
import Button from 'react-bootstrap/Button';
import SchoolService from "../../_common/services/school.js";
import "../../_common/assets/css/register-user.css";
import UserService from "../../_common/services/user";
import Select from "react-select";
import {
  UPDATE_SUCCESS_MSG,
  UPDATE_ERROR_MSG,
  CLEAR_ERRORS,
} from "../../_store/actions/types";
import { connect } from "react-redux";

const selectStyles = {
  menu: (base) => ({
    ...base,
    zIndex: 100,
  }),
};

/*
 * @author: Tyler Trammell
 * Class that handles the client side addition of a school to an advisor. Associating an advisor with a school
 */
class AddSchoolAdvisor extends Component {
  constructor(props) {
    super(props);
    this.user = this.props.advisorUser;
    this.state = {
      userId: null,
      schoolId: null,
      schoolList: [],
    };
  }

  //Returns a list of all scchools when the component is rendered to be used in the dropdown.
  componentDidMount = () => {
    SchoolService.getAllSchools()
      .then((response) => {
        if (response.statusCode === 200) {
          let schoolbody = JSON.parse(response.body);
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
      .catch((resErr) => console.log("Something went wrong. Please try again"));
  };

  /*
   * Handles the registration of teams and adds the team information to the SQL database.
   */
  handleAddAdvisor = () => {
    const { dispatch } = this.props;

    UserService.updateAdvisorSchool(this.user, this.state.schoolId)
      .then((response) => {
        if (response.statusCode === 200) {
          this.props.dispatchSuccess("Your school updated!");
          this.setState({ redirect: true });
        }
      })
      .catch((error) => {
        this.props.dispatchError("There was an issue adding your school.");
      });
  };

  /*
   * Indicates successful loading of the captcha for debugging purposes
   */
  recaptchaLoaded = () => {
    console.log("captcha successfully loaded.");
  };

  /*
   * Changes the verfied state to true following a verified captcha result.
   */
  verifyCallback = (response) => {
    if (response) this.setState({ isVerified: true });
    else this.setState({ isVerified: false });
  };

  /*
   * Handle the changing of a school - used in School dropdown.
   * @Param schoolId: the value to be set for the schoolId
   */
  handleSchoolChange = (schoolId) => {
    this.setState({ schoolId: schoolId.value });
  };

  /*
   * Renders the form to be filled out for creating/registering a school
   * Uses same elements as previous forms
   *
   */
  render() {
    return (
      <div className="RegisterBox">
        <StatusMessages />
        <h2>Connect Your Main School</h2>
        <p>
          <b>Please fill out the information below.</b>
        </p>
        <div>
          <div id="sub-nav">
            <p id="sub-nav-item">
              <b>Select Your School</b>
            </p>
            <Select
              id="dropdown"
              styles={selectStyles}
              placeholder="Select a school"
              options={this.state.schoolList}
              onChange={this.handleSchoolChange}
            />
          </div>
          <Button
            variant="primary"
            className="RegisterButton"
            style={{
              margin: 15,
              backgroundColor: "#00a655",
              color: "#ffffff",
              fontSize: 14,
            }}
            onClick={(event) => this.handleAddAdvisor(event)}
          >
            OK
          </Button>
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
    dispatchResetErrors: () => dispatch({ type: CLEAR_ERRORS }),
    dispatchError: (message) =>
      dispatch({ type: UPDATE_ERROR_MSG, payload: message }),
    dispatchSuccess: (message) =>
      dispatch({ type: UPDATE_SUCCESS_MSG, payload: message }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddSchoolAdvisor);
