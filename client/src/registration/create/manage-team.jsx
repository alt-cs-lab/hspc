/*
Name: Devin Richards
Created On: 02/07/2024
Last Modified: 02/12/2024
*/
// PURPOSE: This page is used by an advisor to register a team.
/* 
TODO: The file '/workspaces/hspc/client/src/registration/create/team.jsx' will need to be 
deleted after this page is completed because it is an older file that serves the same function.
*/
import React, { Component } from "react";
import StatusMessages from "../../_common/components/status-messages/status-messages.jsx";
import UserService from "../../_common/services/user.js";
import SchoolService from "../../_common/services/school.js";
import Button from "react-bootstrap/Button";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice";
import { Form } from "react-bootstrap";
import BaseSelect from "react-select";
import FixRequiredSelect from "./FixRequiredSelect";

const selectStyles = {
    menu: (base) => ({
        ...base,
        zIndex: 100,
    }),
};

class CreateTeam extends Component {
    constructor(props) {
        super(props);
        this.props.dispatchResetErrors();
        this.advisor = this.props.advisor
        this.state = {
            teamName: "",
            schoolId: null,
            competitionId: null,
            questionLevelId: 1,
            isVerified: false,
            studentList: [],
            schoolList: [],
            columns: this.getColumns()
        }
    }

    /*
    TODO: The 'UserService.getAllStudents' needs to be edited so it 
    returns the students that are asscoiated with the advisor's schools.
    */
    // TODO: Update UserService to HighSchoolStudentService
    componentDidMount = () => {
        UserService.getAllStudents(this.advisor.email, this.advisor.accessLevel)
        .then((response) => {
            if(response.ok){
                this.setState({ studentList: response.data });
            } else console.log("An error has occured. Please try again");
        })
        .catch((resErr) => console.log("Something went wrong. Please try again."));

        SchoolService.getAdvisorSchools(this.advisor.id)
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
            .catch((resErr) => console.log("Something went wrong. Please try again"));
    }

    getColumns(){
        return [ 
            {
                name: "Student ID",
                selector: row => row.studentid,
                sortable: true,
            },
            {
                name: "First Name",
                selector: row => row.firstname,
                sortable: true,
            },
            {
                name: "Last Name",
                selector: row => row.lastname,
                sortable: true,
            },
            {
                name: "School",
                selector: row => row.schoolid,
                sortable: true,
            },
            {
                name: "Email",
                selector: row => row.email,
                sortable: true,
            },
            {
                name: "GradDate",
                selector: row => row.graddate,
                sortable: true,
            }
        ]
    }

    /* 
    TODO: 
        - Create event handler 'handleRegisterTeam()' for the "Register Team" button.
        - Create event handler 'handleChange' for selected students in datatable to be placed in an array.
    */
    // handleRegisterTeam(){
    //     TeamService.registerTeam(teamName, schoolId, competitionId, questionLevelId, advisorId);
    // }
    handleSchoolChange = (schoolId) => {
        this.setState({schoolId: schoolId.value});
    }

    render(){
        return(
            <div>
                <StatusMessages/>
                <h2>Team Creation</h2>
                <p>
                    <b>Please fill out the information below.</b>
                </p>
                <Form>
                    <Form.Group>
                    <Form.Label>Team Name</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            label=""
                            style={{margin: "10px"}}
                            inputProps={{style: {fontSize: 14}}}
                            InputLabelProps={{style: {fontSize: 13}}}
                            onChange={(event) =>
                                this.setState({teamName: event.target.value})
                            }
                            size="small">
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <div id ="sub-nav">
                            <p id="sub-nav-item">
                                <b>School</b>
                            </p>
                            <FixRequiredSelect
                                id="dropdown"
                                styles={selectStyles}
                                placeholder="Select a school"
                                options={this.state.schoolList}
                                onChange={this.handleSchoolChange}
                                SelectComponent={BaseSelect}
                                setValue={this.state.schoolId}
                            />
                        </div>
                    </Form.Group>
                    <Form.Group>
                            {this.state.studentList.map((student, index) => (                                
                                <Form.Control as="checkbox">
                                <label key={student.studentid}>
                                    <input type="checkbox" value={student.studentid}/>
                                    {student.firstname}
                                    {student.lastname}
                                </label>                                
                            </Form.Control>
                            ))}
                    </Form.Group>
                    {/* onClick={() => handleRegisterTeam()}                    */}
                    <Button type="register">Register Team</Button>
                </Form>
            </div>
        )
    }
};

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
  
  export default connect(mapStateToProps, mapDispatchToProps)(CreateTeam);