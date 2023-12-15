/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import { withRouter } from "../../_utilities/routerUtils"
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Form, ToggleButtonGroup, ToggleButton } from "react-bootstrap";

import ReCAPTCHA from "react-recaptcha";
import StatusMessages from "../../_common/components/status-messages/status-messages";
import "../../_common/assets/css/register-user.css";
import { registerUser } from "../../_store/actions/authActions";
import UserService from "../../_common/services/user"; //added so students can bee created at the same time they are made into users Natalie Laughlin
import {
  SET_SCHOOL_DROPDOWN_REQUIRED,
} from "../../_store/actions/types";
import BaseSelect from "react-select";
import FixRequiredSelect from "./FixRequiredSelect";
import SchoolService from "../../_common/services/school.js";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice";

const selectStyles = {
  menu: (base) => ({
    ...base,
    zIndex: 100,
  }),
};

const Roles = {
	Volunteer: 20,
	Advisor: 60
}

/*
 * @author: Daniel Bell
 * @Updated: Natalie Laughlin - create student and Advisors adding instructions on the phone number
 */
class Register extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.recaptchaLoaded = this.recaptchaLoaded.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      schoolid: 0,
      requestLevel: Roles.Volunteer,
      advisoremail: "",
      teamName: "",
      schoolList: [],
      isVerified: false,
    };
  }

  /*
    Added a componentDidMount to retrieve all the schools from the database
  */
  componentDidMount = () => {
    this.changeFields(Roles.Volunteer);
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
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
  };

  /*
   * Handles the registration of users and adds the user information to the SQL database.
   */
  handleRegister(event) {
    event.preventDefault();
    const newUser = this.state;
    if (this.state.isVerified) {
      if (this.state.requestLevel === Roles.Volunteer) {
        this.props.registerUser(newUser, this.props.history);
      } else {
        console.log(newUser);
        //need to make an advisor
        UserService.addadvisor(
          newUser.firstName,
          newUser.lastName,
          newUser.email.toLowerCase(),
          newUser.phone,
          newUser.requestLevel,
          newUser.password,
          newUser.schoolList[newUser.schoolid]
        )
          .then((response) => {
            this.props.dispatchSuccess("Registration successful!");
            this.resetFields();
          })
          .catch((error) => {
            this.props.dispatchError("There was an error creating an Advisor.");
          });

        // this.props.history.push("/login");
      }
    } else {
      this.props.dispatchError("Please verify you are a human.");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  resetFields = () => {
    this.setState({ firstName: "" });
    this.setState({ lastName: "" });
    this.setState({ email: "" });
    this.setState({ password: "" });
    this.setState({ advisoremail: "" });
    this.setState({ phone: "" });
    this.setState({ schoolid: 0 });
  };

  /*
   * Indicates successful loading of the captcha for debugging purposes
   */
  recaptchaLoaded() {
    console.log("captcha successfully loaded.");
  }

  /*
   * Changes the verfied state to true following a verified captcha result.
   */
  verifyCallback(response) {
    if (response) this.setState({ isVerified: true });
    else this.setState({ isVerified: false });
  }

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
    if (value === Roles.Volunteer) {
      this.setState({ requestLevel: Roles.Volunteer });
      document.getElementById("schoolList").hidden = true;
      this.props.dispatchDropdownRequiredUpdate(false);
    } else {
      this.setState({ requestLevel: Roles.Advisor });
      document.getElementById("schoolList").hidden = false;
      this.props.dispatchDropdownRequiredUpdate(true);
    }
  }
  /*
   * Handle the changing of a school - used in School dropdown.
   * @Param schoolId: the value to be set for the schoolId
   */
  handleSchoolChange = (schoolId) => {
    this.setState({ schoolId: schoolId.value });
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
            defaultValue={Roles.Volunteer}
            >
            <ToggleButton 
              id="tbg-radio-2"
              value={Roles.Volunteer} 
              onClick={(event) => this.changeFields(Roles.Volunteer)}
              >
              Volunteer
            </ToggleButton>
            <ToggleButton 
              id="tbg-radio-1"
              value={Roles.Advisor} 
              onClick={(event) => this.changeFields(Roles.Advisor)}
              >
              Advisor
            </ToggleButton>
          </ToggleButtonGroup>
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
          {/* Would no longer be necessary with database changes
          <div name="email-div" id="email">
            {
              //added so that the student can put their advisors email in Natalie Laughlin
            }
            <Form.Text
              variant="filled"
              id="emailField"
              label="Advisor's Email"
              required
              style={{ margin: "5px", width: "15%" }}
              inputProps={{ style: { fontSize: 14 } }}
              InputLabelProps={{ style: { fontSize: 14 } }}
              onChange={(target) =>
                this.setState({
                  advisoremail: target.target.value.toLowerCase(),
                })
              }
              size="small"
              value={this.state.advisoremail}
            />
          </div>
          */}
          <div name="dropdown-div" id="schoolList" hidden={true}>
            <FixRequiredSelect
              id="dropdown"
              styles={selectStyles}
              placeholder="Select a School"
              options={this.state.schoolList}
              onChange={this.handleSchoolChange}
              SelectComponent={BaseSelect}
              setValue={this.state.schoolid}
            />
            <br />
          </div>
          <br />
          <br />
          <div name="captcha" align="center">
            <ReCAPTCHA
              sitekey="6LdB8YoUAAAAAL5OtI4zXys_QDLidEuqpkwd3sKN"
              render="explicit"
              onloadCallback={this.recaptchaLoaded}
              verifyCallback={this.verifyCallback}
              size="small"
            />
          </div>
          <br />
          <Button
            variant="primary"
            id="submit-button"
            label="Create Account"
            style={{
              fontSize: "14px",
              backgroundColor: "#00a655",
              color: "white",
            }}
            type="submit"
          >
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
    registerUser: (newUser, history) =>
      dispatch(registerUser(newUser, history)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Register));
