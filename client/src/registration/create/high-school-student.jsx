/**
 * Author: Devan Griffin
 * Modified: 4/24/2024
 */

import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import StudentService from "../../_common/services/high-school-student.js";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";
import { Form } from "react-bootstrap";
import Select from "react-select";
import SchoolService from "../../_common/services/school.js";
import "../../_common/assets/css/standard.css";

const constants = require('../../_utilities/constants.js');

/*
 * A component for adding a student
 */
class AddStudent extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.advisor = this.props.auth.user;
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      gradMonth: constants.months[4].value,
      gradYear: "",
      schoolId: -1,
      schoolList: []
    };
  }

  /**
   * Runs when the page is opened
   * Returns a list of all schools when the component is rendered to be used in the dropdown.
   */
  componentDidMount = () => {
    SchoolService.getAdvisorApprovedSchools(this.advisor.id, this.advisor.accessLevel)
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
  };

  /**
   * Sends the new student to the database
   * @param {*} event 
   */
  createStudent(event) {
    const newStudent = this.state;

    /* Sets the graduation date to the 28th day of the month */
    const gradDate = constants.toDatabaseDate(newStudent.gradYear, newStudent.gradMonth, 28);

    StudentService.addHighSchoolStudent(newStudent.firstName, newStudent.lastName, newStudent.schoolId, newStudent.email, gradDate)
    .then((response) => {
      if(response.status === 201){
        this.props.dispatchSuccess("Student Created")
      }
      else{
        this.props.dispatchError(response.data)
      }
    }).catch((resErr) => console.log("Something went wrong connecting to the server. Please try again"));
  }

  /*
   * Renders the form to be filled out for creating/registering a student
   */
  render() {
    return (
      <div className="RegisterBox">
        <h2>Create Students For Your School</h2>  
        <Form onSubmit={(event) => this.createStudent(event)}>
          <div class="add-margin">
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control required placeholder="Ex: Devan" onChange={(target => this.setState({ firstName: target.target.value }))} 
                value={ this.state.firstName }/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control required placeholder="Ex: Griffin" onChange={(target => this.setState({ lastName: target.target.value }))} 
                value={ this.state.lastName }/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>School</Form.Label>
              <Select options={this.state.schoolList} onChange={(target => this.setState({ schoolId: target.value }))}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" required placeholder="Ex: devangriffin@email.com" 
                onChange={(target => this.setState({ email: target.target.value }))} value={ this.state.email }/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Graduation Month</Form.Label>
              <Select placeholder="Select a Month" options={constants.months} 
                  onChange={( target => this.setState({ gradMonth: target.value }))} defaultValue={constants.months[4]}/>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Graduation Year</Form.Label>
              <Form.Control type="number" required placeholder="Ex: 2024"
                onChange={(target => this.setState({ gradYear: target.target.value }))} value={ this.state.gradYear }/>
            </Form.Group>
          </div>
          <Button type="submit">
            Create Student
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
		dispatchError: (message) =>
			dispatch(updateErrorMsg(message)),
		dispatchSuccess: (message) =>
			dispatch(updateSuccessMsg(message))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddStudent);
