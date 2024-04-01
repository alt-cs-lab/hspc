import React from 'react';
import { useEffect, useState } from 'react';
import { Button, Form } from "react-bootstrap";
import SchoolService from "../_common/services/school"
import RequestService from "../_common/services/request";
import UserService from "../_common/services/user"
import DataTable from "react-data-table-component";
import BaseSelect from "react-select";
import FixRequiredSelect from "../_common/components/FixRequiredSelect";
import { withRouter } from "../_utilities/routerUtils";
import "../_common/assets/css/standard.css";
import "../_common/assets/css/advisor.css";
import { connect } from "react-redux";
import Auth from "../_common/services/auth.js";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../_store/slices/errorSlice";
const constants = require('../_utilities/constants');
const styles = require('../_utilities/styleConstants.js');

/**
 * @returns The Dashboard Home Page which allows account changes
 * @author Trent Powell
 */
function DashboardHome(props){
    const [firstName, setFirstName] = useState(props.user.firstName);
    const [lastName, setLastName] = useState(props.user.lastName);
    const [phoneNumber, setPhoneNumber] = useState(props.user.phone);
    const [email, setEmail] = useState(props.user.email);
    const [schoolList, setSchoolList] = useState([]);
    const [allSchoolsList, setAllSchoolsList] = useState([]);
    const [additionalSchoolid, setAdditionalSchoolid] = useState(null);

    useEffect(()=>{
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
            setAllSchoolsList(schools);
          } else console.log("An error has occurred, Please try again.");
        })
        .catch((resErr) => console.log("Something went wrong. Please try again"));

        SchoolService.getAdvisorSchools(props.user.id)
        .then((response) => {
            if (response.ok) {
                setSchoolList(response.data);
            } else console.log("An error has occurred, Please try again.");
        })
        .catch((resErr) => console.log("Something went wrong. Please try again"));
    }, [ props.user ]);
    
    return (
        <div>
            <h2 id="welcome">Welcome {props.user.firstName} {props.user.lastName}!</h2>
            {props.user.accessLevel === constants.ADVISOR ? (
                <div>
                    <hr/>
                    <h4>Advisor Schools</h4>
                    <div id="advisor-data-table">
                        <DataTable data={schoolList} columns={getColumns()}/>
                    </div>
                    <br/>
                    <Form name="form" onSubmit={(event) => handleRequestNewSchool(event, additionalSchoolid, props.user.id)}>
                        <Form.Group name="dropdown-div" id="schoolList">
                            <div className="add-margin">
                                <Form.Label>
                                    <b>Request an additional school:</b>
                                </Form.Label>
                                <FixRequiredSelect
                                    required
                                    style={{ margin: "auto", width: "25%" }}
                                    styles={styles.selectStyles}
                                    placeholder="Select a School"
                                    options={allSchoolsList}
                                    onChange={(target) => setAdditionalSchoolid(target.value)}
                                    SelectComponent={BaseSelect}
                                    setValue={additionalSchoolid}
                                    />
                            </div>
                        </Form.Group>
                        <Button id="purple-button" type="submit">
                            Request School
                        </Button>
                    </Form>
                </div>
            ) : ( "" )}
            {props.user.accessLevel === constants.VOLUNTEER ? (
                <div>
                    <hr/>
                    <p>Add "Pending Volunteer Requests and Assignments" Here (Account only for upcoming Competitions)</p>
                </div>
            ) : ( "" )}
            <hr/>
            <h4>Account Profile</h4>
            <h6>Update profile settings below if something has changed.</h6>
            <br/>
            <Form name="form" onSubmit={(event) => handleProfileUpdate(event, firstName, lastName, phoneNumber, email, props)}>
                <div class="add-margin">
                    <Form.Group>
                        <Form.Label id="left-label"> First Name </Form.Label>
                        <Form.Control
                        name="first"
                        placeholder = {props.user.firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                        />
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <Form.Label> Last Name </Form.Label>
                        <Form.Control
                        name="last"
                        placeholder = {props.user.lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                        />
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <Form.Label> Phone Number (No dashes) </Form.Label>
                        <Form.Control name="phone"
                        placeholder = {props.user.phone}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        value={phoneNumber}
                        />
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <Form.Label> Email Address </Form.Label>
                        <Form.Control name="email" type="email"
                        placeholder = {props.user.email}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        />
                    </Form.Group>
                    <br/>
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
            {/* Add "Update Profile Options" Here */}
        </div>
    );
}



function handleRequestNewSchool(event, additionalSchoolid, advisorid) {
    // TODO TWP: Fix Error Dispatching Below
    RequestService.requestAdditionalSchool(additionalSchoolid, advisorid)
    .then((response) => {
        if (response.status === 200) {
            // this.props.dispatchSuccess(
            //     "Registration was successful."
            // );
            window.location.reload();
        }
    })
    .catch((error) => {
        // this.props.dispatchError(
        //     "There was an error requesting an additional school. Please Try Again Later!"
        // );
    });
}

function handleProfileUpdate(event, firstName, lastName, phone, email, props) {
    event.preventDefault();
    const updateData = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email
    };

    UserService.updateProfile(updateData, props.user.id)
    .then((response) => {
        if (response.status === 200) {
          Auth.logout()
          props.dispatchSuccess("Account successfully updated, please login")
          //window.location.reload();
          props.router.navigate("/login", {state:{profileUpdate:'Account successfully updated, please login'}});
        }
    })
    .catch((error) => {
        console.log("Failed to update profile. Please try again.")
    });
}

function getColumns() {
    return [
      {
        name: "USD Code",
        selector: row => row.usdcode,
        sortable: true,
      },
      {
        name: "School Name",
        selector: row => row.schoolname,
        sortable: true,
      },
      {
        name: "City",
        selector: row => row.city,
        sortable: true,
      },
      {
        name: "State",
        selector: row => row.State,
        sortable: true,
      },
      {
        name: "Approved?",
        selector: row => (row.approved === true ? "Approved" : "Pending"),
        sortable: true,
      },
    ];
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
    };
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(withRouter(DashboardHome));