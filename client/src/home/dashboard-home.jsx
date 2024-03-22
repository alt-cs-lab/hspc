import React from 'react';
import { useEffect, useState } from 'react';
import { Button, Form } from "react-bootstrap";
import SchoolService from "../_common/services/school"
import RequestService from "../_common/services/request";
import DataTable from "react-data-table-component";
import BaseSelect from "react-select";
import FixRequiredSelect from "../_common/components/FixRequiredSelect";
import "../_common/assets/css/standard.css";
import "../_common/assets/css/advisor.css";
const constants = require('../_utilities/constants');
const styles = require('../_utilities/styleConstants.js');

/**
 * @returns The Dashboard Home Page which allows account changes
 * @author Trent Powell
 */
export default function DashboardHome(props){
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
            <Form name="form" onSubmit={(event) => handleProfileUpdate(event)}>
                <div class="add-margin">
                    <Form.Group>
                        <Form.Label id="left-label"> First Name </Form.Label>
                        <Form.Control
                        name="first"
                        placeholder = {props.user.firstName}
                        onChange={(target) => setFirstName(target.target.value)}
                        value={firstName}
                        />
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <Form.Label> Last Name </Form.Label>
                        <Form.Control
                        name="last"
                        placeholder = {props.user.lastName}
                        onChange={(target) => setLastName(target.target.value)}
                        value={lastName}
                        />
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <Form.Label> Phone Number (No dashes) </Form.Label>
                        <Form.Control name="phone"
                        placeholder = {props.user.phone}
                        onChange={(target) => setPhoneNumber(target.target.value)}
                        value={phoneNumber}
                        />
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <Form.Label> Email Address </Form.Label>
                        <Form.Control name="email" type="email"
                        placeholder = {props.user.email}
                        onChange={(target) => setEmail(target.target.value)}
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

function handleProfileUpdate(event) {
    // TODO TWP: Need an update profile call to server
    // Reload Page after submission
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