/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import StatusMessages from "../../_common/components/status-messages/status-messages";
import Button from 'react-bootstrap/Button';
// import SchoolService from "../../_common/services/school.js";
import "../../_common/assets/css/register-user.css";
import StudentService from "../../_common/services/high-school-student.js";
import Select from "react-select";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice";
import { Form } from "react-bootstrap";
import BaseSelect from "react-select";
import FixRequiredSelect from "./FixRequiredSelect";
import SchoolService from "../../_common/services/school.js";
// import Col from 'react-bootstrap/Col';
// import Row from 'react-bootstrap/Row';

// const selectStyles = {
//   menu: (base) => ({
//     ...base,
//     zIndex: 100
//   }),
// };

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
 * @author: Tyler Trammell
 * Class that handles the client side addition of a school to an advisor. Associating an advisor with a school
 */
class AddStudent extends Component {
  constructor(props) {
    super(props);
    this.user = this.props.advisorUser;
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      gradMonth: months[4],
      gradYear: "",
      schoolID: 0,
      schoolName: "",
      schoolList: []
    };
  }

  // returnYears()
  // {
  //   var yearList = [];
  //   for (let i = 0; i < 100; i++)
  //   {
  //     yearList[i] = 2024 + i;
  //   }

  //   return yearList;
  // }

  //Returns a list of all schools when the component is rendered to be used in the dropdown.
  // componentDidMount = () => {
  //   SchoolService.getAllSchools()
  //     .then((response) => {
  //       if (response.statusCode === 200) {
  //         let schoolbody = JSON.parse(response.body);
  //         let schools = [];
  //         for (let i = 0; i < schoolbody.length; i++) {
  //           schools.push({
  //             label: schoolbody[i].schoolname,
  //             value: schoolbody[i].schoolid,
  //           });
  //         }
  //         this.setState({ schoolList: schools });
  //       } else console.log("An error has occurred, Please try again.");
  //     })
  //     .catch((resErr) => console.log("Something went wrong. Please try again"));
  // };

  getAdvisorSchools() {

  }

  createStudent(event) {
    const newStudent = this.state;
    // Sets the graduation date to the 28th day of the month
    const gradDate = new Date(newStudent.gradYear, newStudent.gradMonth.value, 28);
    // 181 is a placeholder for schoolID
    StudentService.addHighSchoolStudent(newStudent.firstName, newStudent.lastName, 181, newStudent.email, gradDate);
  }

  /*
   * Renders the form to be filled out for creating/registering a school
   * Uses same elements as previous forms
   *
   */
  render() {
    return (
      <div className="RegisterBox">
        <StatusMessages/>
        <h2>Create Students For Your School</h2>
        <div>
          <Form onSubmit={(event) => this.createStudent(event)}>
            <Form.Group className="m-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control placeholder="Ex: Devan" style={{ margin: "auto", width: "25%"}} onChange={(target => this.setState({ firstName: target.value }))} 
                value={ this.state.firstName }/>
            </Form.Group>
            <Form.Group className="m-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control placeholder="Ex: Griffin" style={{ margin: "auto", width: "25%"}} onChange={(target => this.setState({ lastName: target.value }))} 
                value={ this.state.lastName }/>
            </Form.Group>
            <Form.Group>
              <Form.Label>School</Form.Label>
              <FixRequiredSelect id="dropdown" options={this.state.schoolList} onChange={(target => this.setState({ schoolID: target.value }))}
                SelectComponent={BaseSelect} /* setValue={this.state.schoolId} *//>
            </Form.Group>
            <Form.Group className="m-3">
              <Form.Label>Email</Form.Label>
              <Form.Control placeholder="Ex: devangriffin@email.com" style={{ margin: "auto", width: "25%"}} onChange={(target => this.setState({ email: target.value }))} 
                value={ this.state.email }/>
            </Form.Group>
            <Form.Group className="m-1">
              <Form.Label>Graduation Month</Form.Label>
              <FixRequiredSelect id="dropdown" placeholder="Select a Month" options={months} 
                  onChange={( target => this.setState({ gradMonth: target.value }))} SelectComponent={BaseSelect} setValue={this.state.gradMonth}
                  defaultValue={this.state.gradMonth}/>
            </Form.Group>
            <Form.Group className="m-1">
              <Form.Label>Graduation Year</Form.Label>
              <Form.Control placeholder="Ex: 2024" style={{ margin: "auto", width: "25%"}} onChange={(target => this.setState({ gradYear: target.value }))} 
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
			dispatch(updateSuccessMsg(message))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddStudent);
