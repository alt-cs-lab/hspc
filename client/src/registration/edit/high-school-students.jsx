/**
 * Edit high school students page
 * Author:
 * Modified: 5/1/2024
 */
import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import StudentService from "../../_common/services/high-school-student.js";
import { connect } from "react-redux";
import {
  clearErrors,
  updateErrorMsg,
  updateSuccessMsg,
} from "../../_store/slices/errorSlice.js";
import { Form } from "react-bootstrap";
import Select from "react-select";
import SchoolService from "../../_common/services/school.js";
import "../../_common/assets/css/standard.css";

const constants = require("../../_utilities/constants");

/**
 * A component for editing a student
 */
class EditStudent extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.advisor = this.props.auth.user;
    this.student = this.props.student;
    this.isAdmin = this.props.admin;
    this.state = {
      studentId: this.props.student.studentid,
      firstName: this.props.student.firstname,
      lastName: this.props.student.lastname,
      email: this.props.student.email,
      initialEmail: this.props.student.email,
      gradMonth: "",
      gradYear: "",
      schoolId: this.props.student.schoolid,
      schoolList: [],
      studentSchool: [],
    };
  }

  /**
   * Runs when the page is opened
   * Returns a list of all schools when the component is rendered to be used in the dropdown.
   */
  componentDidMount = () => {
    /**
     * Gets the schools that the advisor is connected to from the api
     * Gets all schools if the user is an admin
     */
    if (this.isAdmin) {
      SchoolService.getAllSchools()
        .then((response) => {
          if (response.ok) {
            let schoolbody = response.data;
            let schools = [];
            let IDSchool = [];
            let id = this.state.schoolId;
            for (let i = 0; i < schoolbody.length; i++) {
              if (schoolbody[i].schoolid === id) {
                IDSchool.push({
                  label: schoolbody[i].schoolname,
                  value: schoolbody[i].schoolid,
                });
              }
              schools.push({
                label: schoolbody[i].schoolname,
                value: schoolbody[i].schoolid,
              });
            }
            this.setState({ schoolList: schools, studentSchool: IDSchool });
          } else console.log("An error has occurred, Please try again.");
        })
        .catch((resErr) =>
          console.log("Something went wrong. Please try again")
        );
    } else {
      SchoolService.getAdvisorApprovedSchools(
        this.advisor.id,
        this.advisor.accessLevel
      )
        .then((response) => {
          if (response.ok) {
            let schoolbody = response.data;
            let schools = [];
            let IDSchool = [];
            let id = this.state.schoolId;
            for (let i = 0; i < schoolbody.length; i++) {
              if (schoolbody[i].schoolid === id) {
                IDSchool.push({
                  label: schoolbody[i].schoolname,
                  value: schoolbody[i].schoolid,
                });
              }
              schools.push({
                label: schoolbody[i].schoolname,
                value: schoolbody[i].schoolid,
              });
            }
            this.setState({ schoolList: schools, studentSchool: IDSchool });
          } else console.log("An error has occurred, Please try again.");
        })
        .catch((resErr) =>
          console.log("Something went wrong. Please try again")
        );
    }
    let date = constants.dateFormat(this.student.graddate);
    let dateArray = date.split("-");
    let dateMonth = parseInt(dateArray[1]);
    this.setState({
      gradYear: dateArray[0],
      gradMonth: constants.months[dateMonth - 1],
    });
  };

  /**
   * Sends a message to the api to update the student in the database
   * @param {*} event
   */
  editStudent = (event) => {
    const newStudent = this.state;

    /* Sets the graduation date to the 28th day of the month */
    const gradDate = constants.toDatabaseDate(
      newStudent.gradYear,
      newStudent.gradMonth.value,
      28
    );

    StudentService.editHighSchoolStudent(
      newStudent.studentId,
      newStudent.firstName,
      newStudent.lastName,
      newStudent.schoolId,
      gradDate
    )
      .then((response) => {
        console.log(response);
        if (response.status === 201) {
          this.props.dispatchSuccess("Student Edited");
        } else {
          this.props.dispatchError(response.data);
        }
      })
      .catch((resErr) =>
        console.log(
          "Something went wrong updating the student. Please try again"
        )
      );
  };

  /**
   * Renders the form to be filled out for editing a student
   */
  render() {
    return (
      <div className="RegisterBox">
        <h2>
          Edit Student - {this.state.firstName} {this.state.lastName}
        </h2>
        <Form onSubmit={(event) => this.editStudent(event)}>
          <div class="add-margin">
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                required
                placeholder="Ex: Devan"
                onChange={(target) =>
                  this.setState({ firstName: target.target.value })
                }
                value={this.state.firstName}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                required
                placeholder="Ex: Griffin"
                onChange={(target) =>
                  this.setState({ lastName: target.target.value })
                }
                value={this.state.lastName}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>School</Form.Label>
              <Select
                options={this.state.schoolList}
                onChange={(target) =>
                  this.setState({
                    studentSchool: target,
                    schoolId: target.value,
                  })
                }
                value={this.state.studentSchool[0]}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                disabled
                type="email"
                required
                placeholder="Ex: devangriffin@email.com"
                onChange={(target) =>
                  this.setState({ email: target.target.value })
                }
                value={this.state.email}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Graduation Month</Form.Label>
              <Select
                placeholder="Select a Month"
                options={constants.months}
                onChange={(target) => this.setState({ gradMonth: target })}
                value={this.state.gradMonth}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Graduation Year</Form.Label>
              <Form.Control
                type="number"
                required
                placeholder="Ex: 2024"
                onChange={(target) =>
                  this.setState({ gradYear: target.target.value })
                }
                defaultValue={this.state.gradYear}
              />
            </Form.Group>
          </div>
          <Button type="submit">Edit Student</Button>
        </Form>
      </div>
    );
  }
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
    dispatchResetErrors: () => dispatch(clearErrors()),
    dispatchError: (message) => dispatch(updateErrorMsg(message)),
    dispatchSuccess: (message) => dispatch(updateSuccessMsg(message)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditStudent);
