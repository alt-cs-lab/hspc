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
import StatusMessages from "../../_common/components/status-messages/status-messages.jsx";
import StudentService from "../../_common/services/high-school-student";
import SchoolService from "../../_common/services/school.js";
import teamService from "../../_common/services/team.js";
import EventService from "../../_common/services/event.js";
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

    // TODO: Update UserService to HighSchoolStudentService
    componentDidMount = () => {
        StudentService.getAdvisorsStudents(this.advisor.idZZ)
        .then((response) => {
            if(response.ok){
                this.setState({ studentList: response.data });
            } else console.log("An error has occured. Please try again");
        })
        .catch((resErr) => console.log("Something went wrong. Please try again."));

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

        SchoolService.getAdvisorSchools(this.advisor.id)
        .then((response) => {
            if (response.ok) {
                console.log(response.data)
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
    *  TODO: Investigate error that says handleRegisterTeam is undefined.
    */
    handleRegisterTeam(){
        if (this.state.teamName === "" || this.state.schoolId === ""){
            this.props.dispatchError(
                "Please check that all fields are complete."
            );
            return;
        }
        // TODO: Setup logic for verified state.
        teamService.registerTeam(
            this.state.teamName, 
            this.state.schoolId, 
            this.state.competitionId,
            this.state.skillLevelId,
            this.advisor.id,
            this.state.studentIds,
            this.state.isVerified
        )
        .then((response) => {
            if (response.ok) {
                console.log(response.data);
                this.props.dispatchSuccess(
                    "Registration was succesful."
                );
                this.resetFields();
                window.location.reload();
            }
        })
        .catch((error) => {
            this.props.dispatchError(
                "There was an error creating the Team."
            );
        });
    }

    resetFields = () => {
        console.log("Reset");
        this.setState({teamName: ""});
        this.setState({schoolId: null});
        this.setState({competitionId: null});
    };

    // TODO: Update the list of students when the school is changed.
    updateStudentList(schoolId) {
        this.setState({schoolId: schoolId.value});
    }

    handleSkillLevelChange = (skillLevelId) => {
        this.setState({skillLevelId: skillLevelId.value});
    }

    handleEventChange = (competitionId) => {
        this.setState({competitionId: competitionId.value});
    }

    // TODO: Have a set number of student slots based off the team member limit for the event.
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
                            style={{ margin: "auto", width: "25%"}}
                            inputProps={{style: {fontSize: 14}}}
                            InputLabelProps={{style: {fontSize: 13}}}
                            onChange={(event) =>
                                this.setState({teamName: event.target.value})
                            }
                            size="small">
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <section
                            style={{
                                display: "flex",
                                justifyContent: "space-evenly",
                                alignItems: "center",
                            }}
                        >
                        <div id ="sub-nav">
                            <p id="sub-nav-item">
                            <b>School</b>
                            </p>
                            <FixRequiredSelect
                                id="dropdown"
                                styles={selectStyles}
                                placeholder="Select a school"
                                options={this.state.schoolList}
                                onChange={(opt) => this.updateStudentList(opt.id)}
                                SelectComponent={BaseSelect}
                                setValue={this.state.schoolId}
                            />
                        </div>
                        <div>
                            <p id="sub-nav-item">
                                <b>Event</b>
                                </p>
                                <FixRequiredSelect
                                    id="dropdown"
                                    styles={selectStyles}
                                    placeholder="Select an event"
                                    options={this.state.eventList}
                                    onChange={this.handleEventChange}
                                    SelectComponent={BaseSelect}
                                    setValue={this.state.competitionId}
                                />
                        </div>
                        <div>
                        <p id="sub-nav-item">
                            <b>Skill Level</b>
                            </p>
                            <FixRequiredSelect
                                id="dropdown"
                                styles={selectStyles}
                                placeholder="Select a skill level"
                                options={this.state.skillLevels}
                                onChange={this.handleSkillLevelChange}
                                SelectComponent={BaseSelect}
                                setValue={this.state.skillLevelId}
                            />
                        </div>
                        </section>
                    </Form.Group>
                    <Form.Group className="text-start">
                            {this.state.studentList.map((student, index) => (    
                            <Form.Check
                                key={student.studentid}
                                type="checkbox"
                                value={student.studentid}
                                label={`${student.firstname}, ${student.lastname}, ${student.email}`}
                                id={`disabled-default-checkbox`}
                            />
                            ))}
                    </Form.Group>
                    <br></br>
                    <Button type="register" onClick={(event) => this.handleRegisterTeam()}>Register Team </Button>
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