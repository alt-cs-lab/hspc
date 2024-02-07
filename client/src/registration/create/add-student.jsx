/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import StatusMessages from "../../_common/components/status-messages/status-messages";
import Button from 'react-bootstrap/Button';
// import SchoolService from "../../_common/services/school.js";
import "../../_common/assets/css/register-user.css";
// import UserService from "../../_common/services/user";
// import Select from "react-select";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice";
import { Form } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

// const selectStyles = {
//   menu: (base) => ({
//     ...base,
//     zIndex: 100,
//   }),
// };

/*
 * @author: Tyler Trammell
 * Class that handles the client side addition of a school to an advisor. Associating an advisor with a school
 */
class AddStudent extends Component {
  constructor(props) {
    super(props);
    this.user = this.props.advisorUser;
    this.state = {
      userId: null
    };
  }

  //Returns a list of all scchools when the component is rendered to be used in the dropdown.
  componentDidMount = () => {
    /*SchoolService.getAllSchools()
      .then((response) => {
        if (response.statusCode === 200) {
          let schoolbody = JSON.parse(response.body);
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
      .catch((resErr) => console.log("Something went wrong. Please try again"));*/
  };

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
        <Form>
            <Form.Group as={Row} className="m-3 w-50">
                <Form.Label column>First Name:</Form.Label>
                <Col>
                    <Form.Control placeholder="Ex: Devan"/>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="m-3 w-50">
                <Form.Label column>Last Name:</Form.Label>
                <Col>
                    <Form.Control placeholder="Ex: Griffin"/>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="m-3 w-50">
                <Form.Label column>Email:</Form.Label>
                <Col>
                    <Form.Control placeholder="devangriffin@email.com"/>
                </Col>
            </Form.Group>
        </Form>

        <Button variant="secondary">Create Student</Button>
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
