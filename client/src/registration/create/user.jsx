/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import { withRouter } from "../../_utilities/routerUtils";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Form, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { registerUser } from "../../_store/actions/authActions";
import Select from "react-select";
import SchoolService from "../../_common/services/school.js";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice";
import "../../_common/assets/css/standard.css";
import "../../_common/assets/css/public-login.css";

const constants = require('../../_utilities/constants')

/*
 * @author: Daniel Bell
 * @Updated: Natalie Laughlin - create student and Advisors adding instructions on the phone number
 */
class Register extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
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
        console.log(response)
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
    this.props.registerUser(newUser, this.props.router);
  }

  resetFields = () => {
    this.setState({ firstName: "", lastName: "", email: "", password: "", advisoremail: "", phone: "", schoolId: 0});
  };

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
    } else {
      this.setState({ requestLevel: constants.ADVISOR });
      document.getElementById("schoolList").hidden = false;
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
      <div name="status-div" class="page-body">
        <h2>Register Account</h2>
        <Form name="form" onSubmit={(event) => this.handleRegister(event)}>
          <ToggleButtonGroup
            type="radio"
            name="options"
            defaultValue={constants.VOLUNTEER}
            >
            <ToggleButton
              variant="secondary"
              id="tbg-radio-2"
              value={constants.VOLUNTEER} 
              onClick={(event) => this.changeFields(constants.VOLUNTEER)}
              >
              Volunteer
            </ToggleButton>
            <ToggleButton 
              variant="secondary"
              id="tbg-radio-1"
              value={constants.ADVISOR} 
              onClick={(event) => this.changeFields(constants.ADVISOR)}
              >
              Advisor
            </ToggleButton>
          </ToggleButtonGroup>
          <br/>
          <div class="add-margin">
            <Form.Group>
              <Form.Label> First Name </Form.Label>
              <Form.Control
                name="first"
                required
                placeholder = "Input First Name"
                inputProps={{ style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
                onChange={(target) =>
                  this.setState({ firstName: target.target.value })
                }
                value={this.state.firstName}
              />
            </Form.Group>
            <br/>
            <Form.Group>
              <Form.Label> Last Name </Form.Label>
              <Form.Control
                name="last"
                required
                placeholder = "Input Last Name"
                inputProps={{ style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
                onChange={(target) =>
                  this.setState({ lastName: target.target.value })
                }
                value={this.state.lastName}
              />
            </Form.Group>
            <br/>
            <Form.Group>
              <Form.Label> Phone Number (No dashes) </Form.Label>
              <Form.Control
                name="phone"
                required
                placeholder = "Input Phone Number"
                inputProps={{ style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
                onChange={(target) => this.setState({ phone: target.target.value })}
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
                placeholder = "email@example.com"
                inputProps={{ style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
                onChange={(target) => this.setState({ email: target.target.value })}
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
                placeholder = "Input Password"
                inputProps={{ style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
                onChange={(target) =>
                  this.setState({ password: target.target.value })
                }
                value={this.state.password}
              />
            </Form.Group>
            <br/>
            <Form.Group name="dropdown-div" id="schoolList" hidden={true}>
              <Form.Label> School </Form.Label>
              <p style={{fontSize:"12px"}}>If your school is not listed please email an admin for addition.</p>
              <Select
                placeholder="Select a School"
                options={this.state.schoolList}
                onChange={this.handleSchoolChange}
              />
            </Form.Group>
          </div>
          <br/>
          <Button id="purple-button" label="Create Account" type="submit">
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
