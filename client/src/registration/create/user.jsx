/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import { withRouter } from "../../_utilities/routerUtils";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Form, ToggleButtonGroup, ToggleButton } from "react-bootstrap";

//import ReCAPTCHA from "react-recaptcha";
import StatusMessages from "../../_common/components/status-messages/status-messages";
import "../../_common/assets/css/register-user.css";
import { registerUser } from "../../_store/actions/authActions";
import {
  SET_SCHOOL_DROPDOWN_REQUIRED,
} from "../../_store/actions/types";
import BaseSelect from "react-select";
import FixRequiredSelect from "../../_common/components/FixRequiredSelect.jsx";
import SchoolService from "../../_common/services/school.js";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice";

const constants = require('../../_utilities/constants')

const selectStyles = {
  menu: (base) => ({
    ...base,
    zIndex: 100,
  }),
};

/*
 * @author: Daniel Bell
 * @Updated: Natalie Laughlin - create student and Advisors adding instructions on the phone number
 */
class Register extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    //this.recaptchaLoaded = this.recaptchaLoaded.bind(this);
    //this.verifyCallback = this.verifyCallback.bind(this);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      schoolId: 0,
      requestLevel: constants.VOLUNTEER,
      teamName: "",
      schoolList: [],
      isVerified: false,
    };
  }

  /*
    Added a componentDidMount to retrieve all the schools from the database
  */
  componentDidMount = () => {
    this.changeFields(constants.VOLUNTEER);
    SchoolService.getAllSchools()
      .then((response) => {
        if (response.ok) {
          let schoolbody = response.data;
          let schools = [];
          for (let i = 0; i < schoolbody.length; i++) {
            schools.push({
              label: schoolbody[i].name,
              value: schoolbody[i].id,
            });
          }
          this.setState({ schoolList: schools });
        } else console.log("An error has occurred retrieving schools, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong attempting to connect to the server. Please try again"));
  };

  /*
   * Handles the registration of users and adds the user information to the SQL database.
   */
  handleRegister(event) {
    event.preventDefault();
    const newUser = this.state;
    // TODO TWP: Do additional Error Checking

    //if (this.state.isVerified) {
        this.props.registerUser(newUser, this.props.router);
    //} else {
    //  this.props.dispatchError("Please verify you are a human.");
    //  window.scrollTo({
    //    top: 0,
    //    behavior: "smooth",
    //  });
    //}
  }

  resetFields = () => {
    this.setState({ firstName: "" });
    this.setState({ lastName: "" });
    this.setState({ email: "" });
    this.setState({ password: "" });
    this.setState({ advisoremail: "" });
    this.setState({ phone: "" });
    this.setState({ schoolId: 0 });
  };

  /*
   * Indicates successful loading of the captcha for debugging purposes
   */
  // recaptchaLoaded() {
  //   console.log("captcha successfully loaded.");
  // }

  /*
   * Changes the verfied state to true following a verified captcha result.
   */
  // verifyCallback(response) {
  //   if (response) this.setState({ isVerified: true });
  //   else this.setState({ isVerified: false });
  // }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  /**
   * @ Natalie Laughlin
   * @param {string} value takes the request level that the user is requesting
   */
  changeFields(value) {
    this.props.dispatchResetErrors();
    if (value === constants.VOLUNTEER) {
      this.setState({ requestLevel: constants.VOLUNTEER });
      document.getElementById("schoolList").hidden = true;
      this.props.dispatchDropdownRequiredUpdate(false);
    } else {
      this.setState({ requestLevel: constants.ADVISOR });
      document.getElementById("schoolList").hidden = false;
      this.props.dispatchDropdownRequiredUpdate(true);
    }
  }
  /*
   * Handle the changing of a school - used in School dropdown.
   * @Param schoolId: the value to be set for the schoolId
   */
  handleSchoolChange = (schoolId) => {
    this.setState({ schoolId: (schoolId.value) });
  };

  /*
   * Renders the component UI.
   */
  render() {
    return (
      <div name="status-div" className="RegisterBox">
        {this.props.errors.errorMsg !== "" ||
        this.props.errors.successMsg !== "" ? (
          <StatusMessages />
        ) : (
          ""
        )}
        <h2>New User?</h2>
        <p>
          <b>Please fill out the information below.</b>
        </p>
        <Form name="form" onSubmit={(event) => this.handleRegister(event)}>
          <p>Please select an account type.</p>
          <ToggleButtonGroup
            className="RoleSelect"
            type="radio"
            name="options"
            defaultValue={constants.VOLUNTEER}
            >
            <ToggleButton 
              id="tbg-radio-2"
              value={constants.VOLUNTEER} 
              onClick={(event) => this.changeFields(constants.VOLUNTEER)}
              >
              Volunteer
            </ToggleButton>
            <ToggleButton 
              id="tbg-radio-1"
              value={constants.ADVISOR} 
              onClick={(event) => this.changeFields(constants.ADVISOR)}
              >
              Advisor
            </ToggleButton>
          </ToggleButtonGroup>
          <br/>
          <Form.Group>
            <Form.Label> First Name </Form.Label>
            <Form.Control
              name="first"
              required
              placeholder = "Input First Name"
              style={{ margin:"auto", width:"25%" }}
              inputProps={{ style: { fontSize: 14 } }}
              InputLabelProps={{ style: { fontSize: 14 } }}
              onChange={(target) =>
                this.setState({ firstName: target.target.value })
              }
              value={this.state.firstName}
              size="small"
            />
          </Form.Group>
          <br/>
          <Form.Group>
            <Form.Label> Last Name </Form.Label>
            <Form.Control
              name="last"
              required
              style={{ margin: "auto", width: "25%" }}
              placeholder = "Input Last Name"
              inputProps={{ style: { fontSize: 14 } }}
              InputLabelProps={{ style: { fontSize: 14 } }}
              onChange={(target) =>
                this.setState({ lastName: target.target.value })
              }
              size="small"
              value={this.state.lastName}
            />
          </Form.Group>
          <br/>
          <Form.Group>
            <Form.Label> Phone Number (No dashes) </Form.Label>
            <Form.Control
              name="phone"
              required
              style={{ margin: "auto", width: "25%" }}
              placeholder = "Input Phone Number"
              inputProps={{ style: { fontSize: 14 } }}
              InputLabelProps={{ style: { fontSize: 14 } }}
              onChange={(target) => this.setState({ phone: target.target.value })}
              size="small"
              value={this.state.phone}
            />
          </Form.Group>
          <br/>
          <Form.Group>
            <Form.Label> Email Address </Form.Label>
            <Form.Control
              name="email"
              type="email"
              required
              style={{ margin: "auto", width: "25%" }}
              placeholder = "email@example.com"
              inputProps={{ style: { fontSize: 14 } }}
              InputLabelProps={{ style: { fontSize: 14 } }}
              onChange={(target) => this.setState({ email: target.target.value })}
              size="small"
              value={this.state.email}
            />
          </Form.Group>
          <br/>
          <Form.Group>
            <Form.Label> Password </Form.Label>
            <Form.Control
              name="password"
              type="password"
              required
              style={{ margin: "auto", width: "25%" }}
              placeholder = "Input Password"
              inputProps={{ style: { fontSize: 14 } }}
              InputLabelProps={{ style: { fontSize: 14 } }}
              onChange={(target) =>
                this.setState({ password: target.target.value })
              }
              size="small"
              value={this.state.password}
            />
          </Form.Group>
          <br/>
          <Form.Group name="dropdown-div" id="schoolList" hidden={true}>
            <Form.Label> School </Form.Label>
            <FixRequiredSelect
              id="dropdown"
              style={{ margin: "auto", width: "100%" }}
              styles={selectStyles}
              placeholder="Select a School"
              options={this.state.schoolList}
              onChange={this.handleSchoolChange}
              SelectComponent={BaseSelect}
              setValue={this.state.schoolId}
            />
          </Form.Group>
          <br/>
          {/* <div name="captcha" align="center">
            <ReCAPTCHA
              sitekey="6LdB8YoUAAAAAL5OtI4zXys_QDLidEuqpkwd3sKN"
              render="explicit"
              onloadCallback={this.recaptchaLoaded}
              verifyCallback={this.verifyCallback}
              size="small"
            />
          </div> */}
          <br/>
          <Button variant="primary" id="submit-button" label="Create Account" type="submit">
            Create Account
          </Button>
        </Form>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    errors: state.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchDropdownRequiredUpdate: (required) =>
      dispatch({ type: SET_SCHOOL_DROPDOWN_REQUIRED, payload: required }),
    dispatchError: (message) =>
      dispatch(updateErrorMsg(message)),
    dispatchSuccess: (message) =>
      dispatch(updateSuccessMsg(message)),
    dispatchResetErrors: () => dispatch(clearErrors()),
    registerUser: (newUser, router) =>
      dispatch(registerUser(newUser, router)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Register));
