/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import "../../_common/assets/css/register-user.css";
import { addHighSchoolStudent } from "../../_common/services/high-school-student.js";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";
import { Form } from "react-bootstrap";
import BaseSelect from "react-select";
import FixRequiredSelect from "../../_common/components/FixRequiredSelect";
import SchoolService from "../../_common/services/school.js";
import { withRouter } from "../../_utilities/routerUtils.jsx";

const constants = require('../../_utilities/constants')

const selectStyles = {
  menu: (base) => ({
    ...base,
    zIndex: 100
  }),
};

const months = 
[
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
]

/*
 * @author: Devan Griffin
 * Class that handles the client side of creating a student
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
      gradMonth: months[4].value,
      gradYear: "",
      schoolId: 0,
      schoolList: []
    };
    // this.errorText = "Test";
  }

  /**
   * Runs when the page is opened
   * Returns a list of all schools when the component is rendered to be used in the dropdown.
   */
  componentDidMount = () => {
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
        } else console.log("An error has occurred, Please try again.");
    })
    .catch((resErr) => console.log("Something went wrong. Please try again"));
  };

  /**
   * Sends the new student to that database
   * @param {*} event 
   */
  createStudent(event) {
    const newStudent = this.state;

    // Sets the graduation date to the 28th day of the month
    const gradDate = constants.toDatabaseDate(newStudent.gradYear, newStudent.gradMonth, 28);

    this.props.addHighSchoolStudent(newStudent.firstName, newStudent.lastName, newStudent.schoolId, newStudent.email, gradDate, this.props.router);
  }

  /*
   * Renders the form to be filled out for creating/registering a student
   */
  render() {
    return (
      <div className="RegisterBox">
        <h2>Create Students For Your School</h2>
        <div>
          <Form onSubmit={(event) => this.createStudent(event)}>
            <Form.Group className="m-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control required placeholder="Ex: Devan" style={{ margin: "auto", width: "25%"}} onChange={(target => this.setState({ firstName: target.target.value }))} 
                value={ this.state.firstName }/>
            </Form.Group>
            <Form.Group className="m-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control required placeholder="Ex: Griffin" style={{ margin: "auto", width: "25%"}} onChange={(target => this.setState({ lastName: target.target.value }))} 
                value={ this.state.lastName }/>
            </Form.Group>
            <Form.Group>
              <Form.Label>School</Form.Label>
              <FixRequiredSelect required id="dropdown" styles={selectStyles} options={this.state.schoolList} onChange={(target => this.setState({ schoolId: target.value }))}
                SelectComponent={BaseSelect} setValue={this.state.schoolId}/>
            </Form.Group>
            <Form.Group className="m-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" required placeholder="Ex: devangriffin@email.com" style={{ margin: "auto", width: "25%"}} 
                onChange={(target => this.setState({ email: target.target.value }))} value={ this.state.email }/>
            </Form.Group>
            <Form.Group className="m-1">
              <Form.Label>Graduation Month</Form.Label>
              <FixRequiredSelect required id="dropdown" styles={selectStyles} placeholder="Select a Month" options={months} 
                  onChange={( target => this.setState({ gradMonth: target.value }))} SelectComponent={BaseSelect} setValue={this.state.gradMonth}
                  defaultValue={months[4]}/>
            </Form.Group>
            <Form.Group className="m-1">
              <Form.Label>Graduation Year</Form.Label>
              <Form.Control type="number" required placeholder="Ex: 2024" style={{ margin: "auto", width: "25%"}} onChange={(target => this.setState({ gradYear: target.target.value }))} 
                value={ this.state.gradYear }/>
            </Form.Group>
            <Button className="m-3" variant="secondary" type="submit">Create Student</Button>
          </Form>
        </div>
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
			dispatch(updateSuccessMsg(message)),
    addHighSchoolStudent: (firstName, lastName, schoolId, email, gradDate, router) =>
      dispatch(addHighSchoolStudent(firstName, lastName, schoolId, email, gradDate, router)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddStudent));
