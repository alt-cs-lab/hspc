/*
Name: Devin Richards
Created On: 02/07/2024
Last Modified: 02/29/2024
*/
// PURPOSE: This page is used by an advisor to register a team.
/* 
TODO: The file '/workspaces/hspc/client/src/registration/create/team.jsx' will need to be 
deleted after this page is completed because it is an older file that serves the same function.
*/
import React, { Component } from "react";
import StudentService from "../../_common/services/high-school-student.js";
import SchoolService from "../../_common/services/school.js";
import teamService from "../../_common/services/team.js";
import EventService from "../../_common/services/event.js";
import Button from "react-bootstrap/Button";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice";
import { Form } from "react-bootstrap";
import Select from "react-select";

const constants = require('../../_utilities/constants');

class CreateTeam extends Component {
    constructor(props) {
        super(props);
        this.props.dispatchResetErrors();
        this.advisor = this.props.advisor
        this.state = {
            teamName: "",
            schoolId: null,
            competitionId: null,
            skillLevelId: null,
            isVerified: false,
            studentList: [],
            studentIds: [],
            skillLevels: [],
            schoolList: [],
            eventList: [],
            columns: this.getColumns()
        }
    }

    componentDidMount = () => {
        // StudentService.getAdvisorsStudents(this.advisor.id)
        // .then((response) => {
        //     if(response.ok){
        //         this.setState({ studentList: response.data });
        //     } else console.log("An error has occured. Please try again");
        // })
        // .catch((resErr) => console.log("Something went wrong. Please try again."));

        teamService.getAllSkillLevels()
        .then((response) => {
            if(response.ok){
                let skillData = response.data;
                let skills = [];
                for (let i=0; i < skillData.length; i++){
                    skills.push({
                        label: skillData[i].skilllevel,
                        value: skillData[i].skilllevelid
                    })
                }
                this.setState({ skillLevels: skills });
            } else console.log("An error has occured. Please try again");
        })
        .catch((resErr) => console.log("Something went wrong. Please try again."));

        EventService.getAllEvents()
        .then((response) => {
            if (response.ok){
                let eventData = response.data;
                let events = [];
                for (let i=0; i < eventData.length; i++){
                    events.push({
                        label: eventData[i].name,
                        value: eventData[i].id
                    })
                }
                this.setState({eventList: events});
            } else console.log("An error has occured. Please try again");
        })
        .catch((resErr) => console.log("Something went wrong. Please try again."));

        SchoolService.getAdvisorApprovedSchools(this.advisor.id)
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
                console.log("Manage");
                console.log(response.data);
            } else console.log("An error has occurred, Please try again.");
        })
        .catch((resErr) => console.log("Something went wrong. Please try again"));
    }

    getColumns(){
        return [
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
                selector: row => constants.gradDateFormat(row.graddate),
                sortable: true,
                sortFunction: constants.dateSort,
            }
        ]
    }

    handleRegisterTeam(){
        if (this.state.teamName === "" || this.state.schoolId === ""){
            this.props.dispatchError(
                "Please check that all fields are complete."
            );
            return;
        }

        // TODO: Setup logic for checking if studentIds contains at least 2 students

        const selectedStudents = Array.from(this.state.studentIds);

        // TODO: Setup logic for verified state.
        teamService.registerTeam(
            this.state.teamName, 
            this.state.schoolId, 
            this.state.competitionId,
            this.state.skillLevelId,
            this.advisor.id,
            selectedStudents,
            this.state.isVerified
        )
        .then((response) => {
            if (response.ok) {
                console.log(response.data);
                this.props.dispatchSuccess(
                    "Registration was successful."
                );
                this.resetFields();
            }
        })
        .catch((error) => {
            this.props.dispatchError(
                "There was an error creating the team."
            );
        });
    }

    // TODO: Remove students from studentList that are already selected.
    /*
    * Updates the list of selected students.
    */
    updateStudentSelected(studentid, index) {
        let newStudentIds = this.state.studentIds;
        newStudentIds[index] = studentid;
        this.setState({studentIds: newStudentIds});
    }

    updateStudentList(schoolId) {
        StudentService.getStudentsWithNoTeam(schoolId).then((response) => {
            let studentData = response.data;
            console.log(studentData);
            let studentOptions = [];
            for (let i = 0; i < studentData.length; i++) {
                studentOptions.push({
                    label: studentData[i].firstname + " " + studentData[i].lastname,
                    value: studentData[i].studentid,
                });
            }
            this.setState({ studentList: studentOptions, studentIds: [], schoolId: schoolId });
        });
    }

    handleSkillLevelChange = (skillLevelId) => {
        this.setState({skillLevelId: skillLevelId.value});
    }

    handleEventChange = (competitionId) => {
        this.setState({competitionId: competitionId.value});
    }

    resetFields = () => {
        console.log("Reset");
        this.setState({ teamName: "", schoolId: null, competitionId: null });
    };

    // TODO: Have a set number of student slots based off the team member limit for the event.
    render(){
        console.log("render", this.state);
        const table = this.state.studentList.length === 0 || this.state.schoolId === null ?
        <p>
            <b>Select A School To Display Students</b>
        </p>:
        <Form.Group class="add-margin">
            <b>Select at least two students to create a team.</b>
            <div className="mb-3">
                <Form.Label>
                    Member #1
                </Form.Label>
                <Select
                    selected={this.state.studentIds[0]}
                    placeholder="Select a student"
                    options={this.state.studentList}
                    onChange={(e)=> this.updateStudentSelected(e.value, 0)}
                />
            </div>
            <div className="mb-3">
                <Form.Label>
                    Member #2
                </Form.Label>
                <Select
                    selected={this.state.studentIds[1]}
                    placeholder="Select a student"
                    options={this.state.studentList}
                    onChange={(e)=> this.updateStudentSelected(e.value, 1)}
                />
            </div>
            <div className="mb-3">
                <Form.Label>
                    Member #3
                </Form.Label>
                <Select
                    selected={this.state.studentIds[2]}
                    placeholder="Select a student"
                    options={this.state.studentList}
                    onChange={(e)=> this.updateStudentSelected(e.value, 2)}
                />
            </div>
            <div className="mb-3">
                <Form.Label>
                    Member #4
                </Form.Label>
                <Select
                    selected={this.state.studentIds[3]}
                    placeholder="Select a student"
                    options={this.state.studentList}
                    onChange={(e)=> this.updateStudentSelected(e.value, 3)}
                />
            </div>
        </Form.Group>
        return(
            <div>
                <h2>Team Creation</h2>
                <p>
                    <b>Please fill out the information below.</b>
                </p>
                <Form> 
                    <div class="add-margin">
                        <Form.Group className="mb-3">
                            <Form.Label>
                                School
                            </Form.Label>
                            <Select
                                placeholder="Select a school"
                                options={this.state.schoolList}
                                onChange={(opt) => this.updateStudentList(opt.value)}
                                />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Event
                            </Form.Label>
                            <Select
                                placeholder="Select an event"
                                options={this.state.eventList}
                                onChange={this.handleEventChange}
                                setValue={this.state.competitionId}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Skill Level
                            </Form.Label>
                            <Select
                                placeholder="Select a skill level"
                                options={this.state.skillLevels}
                                onChange={this.handleSkillLevelChange}
                                setValue={this.state.skillLevelId}
                            />
                        </Form.Group>
                        {table}
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Team Name
                            </Form.Label>
                            <Form.Control
                                type="text"
                                required
                                label=""
                                inputProps={{style: {fontSize: 14}}}
                                InputLabelProps={{style: {fontSize: 13}}}
                                onChange={(event) => this.setState({teamName: event.value})}>
                            </Form.Control>
                        </Form.Group>
                    </div>
                    <Button onClick={(event) => this.handleRegisterTeam()}>Register Team</Button>
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