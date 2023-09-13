/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import Button from 'react-bootstrap/Button';

import Form from 'react-bootstrap/Form'
import ReCAPTCHA from "react-recaptcha";
import StatusMessages from "../../_common/components/status-messages/status-messages";
import "../../_common/assets/css/register-user.css";
import { registerUser } from "../../_store/actions/authActions";
import UserService from "../../_common/services/user"; //added so students can bee created at the same time they are made into users Natalie Laughlin
import {
  CLEAR_ERRORS,
  UPDATE_ERROR_MSG,
  UPDATE_SUCCESS_MSG,
  SET_SCHOOL_DROPDOWN_REQUIRED,
} from "../../_store/actions/types";
import BaseSelect from "react-select";
import FixRequiredSelect from "./FixRequiredSelect";
import SchoolService from "../../_common/services/school.js";

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
    this.recaptchaLoaded = this.recaptchaLoaded.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      schoolid: 0,
      accessLevel: 1,
      requestLevel: 1,
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
    this.changeFields(1);
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
   * Handles the registration of users and adds the user information to the SQL database.
   */
  handleRegister(event) {
    event.preventDefault();
    const newUser = this.state;
    if (this.state.isVerified) {
      if (this.state.requestLevel === 20 || this.state.requestLevel === 40) {
        //if not a student register normaly
        this.props.registerUser(newUser, this.props.history);
      } else if (this.state.requestLevel === 60) {
        console.log(newUser);
        //need to make an advisor
        UserService.addadvisor(
          newUser.firstName,
          newUser.lastName,
          newUser.email.toLowerCase(),
          newUser.phone,
          newUser.accessLevel,
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
      } else {
        //needs to make them a student
        UserService.addstudent(
          newUser.firstName,
          newUser.lastName,
          newUser.email.toLowerCase(),
          newUser.phone,
          newUser.accessLevel,
          newUser.requestLevel,
          newUser.password,
          newUser.advisoremail.toLowerCase()
        )
          .then((response) => {
            this.props.dispatchSuccess("Registration Successful!");
            this.resetFields();
          })
          .catch((error) => {
            console.log(error);
            this.props.dispatchError("There was an error creating a Student.");
          });
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
   * Handle the changing of access level.
   */
  accessLevelChange = (value) => {
    this.setState({ accessLevel: value }, () => {
      console.log("Access level changed.");
      if (this.state.accessLevel !== 1) {
        this.setState({ requestLevel: value, accessLevel: "1" }, () => {
          this.props.dispatchError(
            "Selections other than 'Student' will be subject to further review"
          );
        });
      } else {
        this.setState({ requestLevel: value, accessLevel: "1" });
        this.props.dispatchResetErrors();
      }
    });
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
  /*
   * made the phone message appear  Natalie Laughlin
   */
  phonemessageunhide() {
    document.getElementById("phone").hidden = false;
    document.getElementById("phone").style.color = "red";
  }
  /*
   *hides the phone message  Natalie Laughlin
   */
  phonemessagehide() {
    document.getElementById("phone").hidden = true;
  }

  /**
   * @ Natalie Laughlin
   * @param {string} value takes the access level that the user is requesting
   */
  changeFields(value) {
    this.props.dispatchResetErrors();
    this.phonemessagehide();
    if (value === 1) {
      this.accessLevelChange(1);
      document.getElementById("email").hidden = false;
      document.getElementById("emailField").required = true;
      document.getElementById("schoolList").hidden = true;
      this.props.dispatchDropdownRequiredUpdate(false);
    }
    if (value === 20) {
      this.accessLevelChange(20);

      document.getElementById("email").hidden = true;
      document.getElementById("emailField").required = false;
      document.getElementById("schoolList").hidden = true;
      this.props.dispatchDropdownRequiredUpdate(false);
    }
    if (value === 40) {
      this.accessLevelChange(40);

      document.getElementById("email").hidden = true;
      document.getElementById("emailField").required = false;
      document.getElementById("schoolList").hidden = true;
      this.props.dispatchDropdownRequiredUpdate(false);
    }
    if (value === 60) {
      this.accessLevelChange(60);
      document.getElementById("email").hidden = true;
      document.getElementById("emailField").required = false;
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
          {/*TODO: update to BOOTSTRAP*/}
          <TextField
            name="first"
            variant="filled"
            label="First Name"
            required
            style={{ margin: "5px", width: "15%" }}
            inputProps={{ style: { fontSize: 14 } }}
            InputLabelProps={{ style: { fontSize: 14 } }}
            onChange={(target) =>
              this.setState({ firstName: target.target.value })
            }
            value={this.state.firstName}
            onFocus={(target, value) => this.phonemessagehide()}
            size="small"
          />
          <br />
          <TextField
            name="last"
            variant="filled"
            label="Last Name"
            required
            style={{ margin: "5px", width: "15%" }}
            inputProps={{ style: { fontSize: 14 } }}
            InputLabelProps={{ style: { fontSize: 14 } }}
            onChange={(target) =>
              this.setState({ lastName: target.target.value })
            }
            onFocus={(target, value) => this.phonemessagehide()}
            size="small"
            value={this.state.lastName}
          />{" "}
          <div name="phone-div">
            {
              //  created a div so that the messaged could appear depending on if the users was focused in the phone number  Nataie Laughlin
            }
            <TextField
              variant="filled"
              label="Phone Number (Optional)"
              style={{ margin: "5px", width: "15%" }}
              inputProps={{ style: { fontSize: 14 } }}
              InputLabelProps={{ style: { fontSize: 14 } }}
              onChange={(target) =>
                this.setState({ phone: target.target.value })
              }
              onFocus={(target, value) => this.phonemessageunhide()}
              size="small"
              value={this.state.phone}
            />
            <h6 id="phone" hidden={true}>
              No dashes
            </h6>
          </div>
          <TextField
            name="email"
            variant="filled"
            type="email"
            label="Email"
            required
            style={{ margin: "5px", width: "15%" }}
            inputProps={{ style: { fontSize: 14 } }}
            InputLabelProps={{ style: { fontSize: 14 } }}
            onChange={(target) => this.setState({ email: target.target.value })}
            onFocus={(target, value) => this.phonemessagehide()}
            size="small"
            value={this.state.email}
          />
          <br />
          <TextField
            name="password"
            variant="filled"
            type="password"
            label="Password"
            required
            style={{ margin: "5px", width: "15%" }}
            inputProps={{ style: { fontSize: 14 } }}
            InputLabelProps={{ style: { fontSize: 14 } }}
            onChange={(target) =>
              this.setState({ password: target.target.value })
            }
            onFocus={(target, value) => this.phonemessagehide()}
            size="small"
            value={this.state.password}
          />
          <br />
          <div name="email-div" id="email">
            {
              //added so that the student can put their advisors email in Natalie Laughlin
            }
            <TextField
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
              onFocus={(target, value) => this.phonemessagehide()}
              size="small"
              value={this.state.advisoremail}
            />
            <br />
          </div>
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
          <p>
            <br />
            Please select an account type.
          </p>
          <ToggleButtonGroup
            className="RoleSelect"
            type="radio"
            name="options"
            defaultValue={1}
          >
            <ToggleButton value={1} onClick={(event) => this.changeFields(1)}>
              Student
            </ToggleButton>
            <ToggleButton value={20} onClick={(event) => this.changeFields(20)}>
              Volunteer
            </ToggleButton>
            <ToggleButton value={40} onClick={(event) => this.changeFields(40)}>
              Judge
            </ToggleButton>
            <ToggleButton value={60} onClick={(event) => this.changeFields(60)}>
              Advisor
            </ToggleButton>
          </ToggleButtonGroup>
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
      dispatch({ type: UPDATE_ERROR_MSG, payload: message }),
    dispatchSuccess: (message) =>
      dispatch({ type: UPDATE_SUCCESS_MSG, payload: message }),
    dispatchResetErrors: () => dispatch({ type: CLEAR_ERRORS }),
    registerUser: (newUser, history) =>
      dispatch(registerUser(newUser, history)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Register));
