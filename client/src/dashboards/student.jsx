/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React, { Component } from "react";
import { Navbar, NavItem, Nav, Jumbotron } from "react-bootstrap";
import ViewEvents from "../registration/view/events";
import ViewQuestions from "../registration/view/questions";
import StatusMessages from "../_common/components/status-messages/status-messages.jsx";
import "../_common/assets/css/dashboard-student.css";
import { CLEAR_ERRORS } from "../_store/actions/types";
import { connect } from "react-redux";
// import ViewEvents from '../registration/view/events.jsx';

var currentView = null;

/*
 * @author: Daniel Bell
 */
export class StudentDash extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.state = {};
  }

  /*
   * Resets the currentView property to null and clears the screen.
   */
  clearAll = () => {
    currentView = null;
    this.forceUpdate();
  };
  /*
   * Taken from master.jsx
   */
  handleShowEvent = () => {
    currentView = <ViewEvents />;
    this.forceUpdate();
  };

  /*
   * Need to add the the code to display the questions
   * Natalie Laughlin
   */
  handleShowQuestions = () => {
    currentView = <ViewQuestions />;
    this.forceUpdate();
  };
  /*
   * Resets the currentView property to the default.  ADDED BUT DOES NOT WORK Natalie Laughlin
   */
  handleShowDefault = () => {
    currentView = (
      <h2 id="welcome">
        Welcome {this.currentUserName.FirstName} {this.currentUserName.LastName}
        !
      </h2>
    );
    this.forceUpdate();
  };
  /*
   * Renders the component UI.
   */
  render() {
    return (
      <div>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand onClick={this.clearAll}>Student Portal</Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} onClick={this.handleShowQuestions}>
                Questions
              </NavItem>
              <NavItem eventKey={2} onClick={this.handleShowEvent}>
                Events
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Jumbotron className="page-body">
          <StatusMessages />
          {currentView}
        </Jumbotron>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchResetErrors: () => dispatch({ type: CLEAR_ERRORS }),
  };
};

export default connect(null,mapDispatchToProps)(StudentDash);
