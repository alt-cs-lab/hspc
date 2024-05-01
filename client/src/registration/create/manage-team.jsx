/*
Name: Devin Richards
Created On: 02/07/2024
Last Modified: 04/17/2024
*/
// PURPOSE: This page is used by an advisor to register a team for an event.
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
import {
  clearErrors,
  updateErrorMsg,
  updateSuccessMsg,
} from "../../_store/slices/errorSlice";
import { Form } from "react-bootstrap";
import Select from "react-select";

// const constants = require('../../_utilities/constants');

class CreateTeam extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.advisor = this.props.advisor;
    this.state = {
      teamName: "",
      schoolId: null,
      competitionId: null,
      skillLevelId: null,
      isVerified: false,
      studentList: [],
      member1: null,
      member2: null,
      member3: null,
      member4: null,
      skillLevels: [],
      schoolList: [],
      eventList: [],
    };
  }

  componentDidMount = () => {
    /*
     * Gets all the skill levels
     */
    teamService
      .getAllSkillLevels()
      .then((response) => {
        if (response.ok) {
          let skillData = response.data;
          let skills = [];
          for (let i = 0; i < skillData.length; i++) {
            skills.push({
              label: skillData[i].skilllevel,
              value: skillData[i].skilllevelid,
            });
          }
          this.setState({ skillLevels: skills });
        } else console.log("An error has occured. Please try again");
      })
      .catch((resErr) =>
        console.log("Something went wrong. Please try again.")
      );

    /*
     * Get Published Events
     */
    EventService.getPublishedEvents()
      .then((response) => {
        if (response.ok) {
          let eventData = response.data;
          let events = [];
          for (let i = 0; i < eventData.length; i++) {
            if (eventData[i].status === "Registerable") {
              events.push({
                label: eventData[i].name,
                value: eventData[i].id,
              });
            }
          }
          this.setState({ eventList: events });
        } else console.log("An error has occured. Please try again");
      })
      .catch((resErr) =>
        console.log("Something went wrong. Please try again.")
      );

    /*
     * Gets all the advisor's approved schools.
     */
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
  };

  /**
   * Provides a list of students based on what school is selected.
   * @param {*} schoolId The ID of the selected school.
   */
  createStudentList(schoolId) {
    StudentService.getStudentsWithNoTeam(schoolId).then((response) => {
      let studentData = response.data;
      let studentOptions = [];
      for (let i = 0; i < studentData.length; i++) {
        studentOptions.push({
          label:
            studentData[i].firstname +
            " " +
            studentData[i].lastname +
            ", " +
            studentData[i].email,
          value: studentData[i].studentid,
        });
      }
      this.setState({
        studentList: studentOptions,
        schoolId: schoolId,
        member1: null,
        member2: null,
        member3: null,
        member4: null,
      });
    });
  }

  /**
   * Handles the registration of a team.
   * @returns
   */
  handleRegisterTeam() {
    if (
      this.state.teamName === "" ||
      this.state.schoolId === null ||
      this.state.competitionId === null ||
      this.state.skillLevelId === null
    ) {
      this.props.dispatchError("Please check that all fields are complete.");
      return;
    }

    let mem1 = this.state.member1;
    let mem2 = this.state.member2;
    let mem3 = this.state.member3;
    let mem4 = this.state.member4;

    /*
     * Creates an array of the selected students.
     */
    let selectedStudents = new Set([mem1, mem2, mem3, mem4]);
    const uniqueValues = new Set();
    const duplicates = [];

    /*
     * Removes members whose values are null.
     */
    selectedStudents.forEach((item) => {
      if (item === null) {
        selectedStudents.delete(item);
      }
    });

    /*
     * Checks if at least two students students are selected.
     */
    if (selectedStudents.length < 2) {
      this.props.dispatchError("Select at least two students to form a team.");
      return;
    }

    /*
     * Checks if the user selected the same student more than once.
     */
    selectedStudents.forEach((item) => {
      if (uniqueValues.has(item)) {
        duplicates.push(item);
      } else {
        uniqueValues.add(item);
      }
    });

    if (duplicates.length >= 1) {
      this.props.dispatchError("A student can only be selected once.");
      this.createStudentList(this.state.studentid);
      return;
    }

    const finalMembers = Array.from(selectedStudents);

    /*
     * Calls on the registerTeam function to create the team.
     */
    // TODO: Attach a teamstatusid and timecreated to the team
    teamService
      .registerTeam(
        this.state.teamName,
        this.state.schoolId,
        this.state.competitionId,
        this.state.skillLevelId,
        this.advisor.id,
        finalMembers,
        this.state.isVerified
      )
      .then((response) => {
        if (response.ok) {
          console.log(response.data);
          this.props.dispatchSuccess("Registration was successful.");
          this.resetFields();
        }
      })
      .catch((error) => {
        this.props.dispatchError("There was an error creating the team.");
      });
  }

  /*
   * Clears out the information in some fields so that the page can be used again.
   */
  resetFields = () => {
    console.log("Reset");
    this.setState({
      teamName: "",
      schoolId: null,
      competitionId: null,
      member1: null,
      member2: null,
      member3: null,
      member4: null,
    });
  };

  render() {
    const table =
      this.state.studentList.length === 0 || this.state.schoolId === null ? (
        <p>
          <b>Select A School To Display Students</b>
        </p>
      ) : (
        <Form.Group class="add-margin">
          <b>Select at least two students to create a team.</b>
          <div className="mb-3">
            <Form.Label>Member #1</Form.Label>
            <Select
              placeholder="Select a student"
              options={this.state.studentList}
              onChange={(opt) => this.setState({ member1: opt.value })}
            />
          </div>
          <div className="mb-3">
            <Form.Label>Member #2</Form.Label>
            <Select
              placeholder="Select a student"
              options={this.state.studentList}
              onChange={(opt) => this.setState({ member2: opt.value })}
            />
          </div>
          <div className="mb-3">
            <Form.Label>Member #3</Form.Label>
            <Select
              placeholder="Select a student"
              options={this.state.studentList}
              onChange={(opt) => this.setState({ member3: opt.value })}
            />
          </div>
          <div className="mb-3">
            <Form.Label>Member #4</Form.Label>
            <Select
              placeholder="Select a student"
              options={this.state.studentList}
              onChange={(opt) => this.setState({ member4: opt.value })}
            />
          </div>
        </Form.Group>
      );
    return (
      <div>
        <h2>Team Creation</h2>
        <p>
          <b>Please fill out the information below.</b>
        </p>
        <Form>
          <div class="add-margin">
            <Form.Group className="mb-3">
              <Form.Label>School</Form.Label>
              <Select
                placeholder="Select a school"
                options={this.state.schoolList}
                onChange={(opt) => this.createStudentList(opt.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Event</Form.Label>
              <Select
                placeholder="Select an event"
                options={this.state.eventList}
                onChange={(opt) => this.setState({ competitionId: opt.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Skill Level</Form.Label>
              <Select
                placeholder="Select a skill level"
                options={this.state.skillLevels}
                onChange={(opt) => this.setState({ skillLevelId: opt.value })}
              />
            </Form.Group>
            {table}
            <Form.Group className="mb-3">
              <Form.Label>Team Name</Form.Label>
              <Form.Control
                required
                placeholder="Ex: Wildcats"
                onChange={(event) =>
                  this.setState({ teamName: event.target.value })
                }
                value={this.state.teamName}
              ></Form.Control>
            </Form.Group>
          </div>
          <Button onClick={(event) => this.handleRegisterTeam()}>
            Register Team
          </Button>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    errors: state.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchResetErrors: () => dispatch(clearErrors()),
    dispatchError: (message) => dispatch(updateErrorMsg(message)),
    dispatchSuccess: (message) => dispatch(updateSuccessMsg(message)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTeam);
