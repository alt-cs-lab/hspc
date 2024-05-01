/**
 * Home dashboard
 * Author:
 * Modified: 5/1/2024
 */
import React from "react";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import SchoolService from "../_common/services/school";
import RequestService from "../_common/services/request";
import UserService from "../_common/services/user";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { withRouter } from "../_utilities/routerUtils";
import "../_common/assets/css/standard.css";
import { connect } from "react-redux";
import Auth from "../_common/services/auth.js";
import {
  clearErrors,
  updateErrorMsg,
  updateSuccessMsg,
} from "../_store/slices/errorSlice";
const constants = require("../_utilities/constants");

/**
 * @returns The Dashboard Home Page which allows account changes
 * @author Trent Powell
 */
function DashboardHome(props) {
  const [firstName, setFirstName] = useState(props.user.firstName);
  const [lastName, setLastName] = useState(props.user.lastName);
  const [phoneNumber, setPhoneNumber] = useState(props.user.phone);
  const [email, setEmail] = useState(props.user.email);
  const [schoolList, setSchoolList] = useState([]);
  const [allSchoolsList, setAllSchoolsList] = useState([]);
  const [additionalSchoolid, setAdditionalSchoolid] = useState(null);

  useEffect(() => {
    if (props.user.accessLevel === constants.ADVISOR) {
      SchoolService.getAllSchools()
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
            setAllSchoolsList(schools);
          } else console.log("An error has occurred, Please try again.");
        })
        .catch((resErr) =>
          console.log("Something went wrong. Please try again")
        );

      SchoolService.getAdvisorSchools(props.user.id)
        .then((response) => {
          if (response.ok) {
            setSchoolList(response.data);
          } else console.log("An error has occurred, Please try again.");
        })
        .catch((resErr) =>
          console.log("Something went wrong. Please try again")
        );
    }
  }, [props.user]);

  return (
    <div>
      <h2 id="welcome">
        Welcome {props.user.firstName} {props.user.lastName}!
      </h2>
      {props.user.accessLevel === constants.ADVISOR ? (
        <div>
          <hr />
          <h4>Advisor Schools</h4>
          <div id="advisor-data-table">
            <DataTable data={schoolList} columns={getColumns()} />
          </div>
          <br />
          <Form
            name="form"
            onSubmit={(event) =>
              handleRequestNewSchool(
                event,
                additionalSchoolid,
                props.user.id,
                props
              )
            }
          >
            <Form.Group name="dropdown-div" id="schoolList">
              <div className="add-margin">
                <Form.Label>
                  <b>Request an additional school:</b>
                </Form.Label>
                <Select
                  placeholder="Select a School"
                  options={allSchoolsList}
                  onChange={(target) => setAdditionalSchoolid(target.value)}
                />
                <br />
              </div>
            </Form.Group>
            <Button id="purple-button" type="submit">
              Request School
            </Button>
          </Form>
        </div>
      ) : (
        ""
      )}
      {props.user.accessLevel === constants.VOLUNTEER ? (
        <div>
          <hr />
          <p>
            Add "Pending Volunteer Requests and Assignments" Here (Account only
            for upcoming Competitions)
          </p>
        </div>
      ) : (
        ""
      )}
      <hr />
      <h4>Account Profile</h4>
      <h6>Update profile settings below if something has changed.</h6>
      <br />
      <Form
        name="form"
        onSubmit={(event) =>
          handleProfileUpdate(
            event,
            firstName,
            lastName,
            phoneNumber,
            email,
            props
          )
        }
      >
        <div class="add-margin">
          <Form.Group>
            <Form.Label id="left-label"> First Name </Form.Label>
            <Form.Control
              name="first"
              placeholder={props.user.firstName}
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label> Last Name </Form.Label>
            <Form.Control
              name="last"
              placeholder={props.user.lastName}
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label> Phone Number (No dashes) </Form.Label>
            <Form.Control
              name="phone"
              placeholder={props.user.phone}
              onChange={(e) => setPhoneNumber(e.target.value)}
              value={phoneNumber}
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label> Email Address </Form.Label>
            <Form.Control
              name="email"
              type="email"
              placeholder={props.user.email}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </Form.Group>
          <br />
          {/* TODO TWP: Allow Update Password Somehow
                    <Form.Group>
                        <Form.Label> Password </Form.Label>
                        <Form.Control
                        name="password"
                        type="password"
                        style={{ margin: "auto", width: "25%" }}
                        placeholder = "Input Password"
                        onChange={(target) => this.setState({ password: target.target.value })}
                        size="small" value={this.state.password}
                        />
                    </Form.Group>
                    <br/> */}
        </div>
        <Button id="purple-button" label="Update Account" type="submit">
          Update Account
        </Button>
      </Form>
    </div>
  );
}

function handleRequestNewSchool(event, additionalSchoolid, advisorid, props) {
  // TODO TWP: Fix Error Dispatching Below
  RequestService.requestAdditionalSchool(additionalSchoolid, advisorid)
    .then((response) => {
      if (response.status === 200) {
        window.location.reload();
      }
      if (response.data.includes("duplicate")) {
        props.dispatchError("You have already attempted to add this school.");
      }
    })
    .catch((error) => {
      props.dispatchError(
        "There was an error requesting an additional school. Please Try Again Later!"
      );
    });
}

function handleProfileUpdate(event, firstName, lastName, phone, email, props) {
  event.preventDefault();
  const updateData = {
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    email: email,
  };

  UserService.updateProfile(updateData, props.user.id)
    .then((response) => {
      if (response.status === 200) {
        Auth.logout();
        props.dispatchSuccess("Account successfully updated, please login");
        props.router.navigate("/login");
      }
    })
    .catch((error) => {
      console.log("Failed to update profile. Please try again.");
    });
}

function getColumns() {
  return [
    {
      name: "USD Code",
      selector: (row) => row.usdcode,
      sortable: true,
    },
    {
      name: "School Name",
      selector: (row) => row.schoolname,
      sortable: true,
    },
    {
      name: "City",
      selector: (row) => row.city,
      sortable: true,
    },
    {
      name: "State",
      selector: (row) => row.State,
      sortable: true,
    },
    {
      name: "Approved?",
      selector: (row) => row.status,
      sortable: true,
    },
  ];
}

/**
 * Redux initializes props.
 */
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    errors: state.errors,
  };
};

/**
 * Redux updates props.
 */
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchError: (message) => dispatch(updateErrorMsg(message)),
    dispatchSuccess: (message) => dispatch(updateSuccessMsg(message)),
    dispatchResetErrors: () => dispatch(clearErrors()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DashboardHome));
