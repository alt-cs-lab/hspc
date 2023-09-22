/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React, { Component, useState } from "react";
import { Navbar, NavItem, Nav, NavDropdown } from "react-bootstrap";
import ViewEvents from "../registration/view/events";
import ViewQuestions from "../registration/view/questions";
import StatusMessages from "../_common/components/status-messages/status-messages.jsx";
import "../_common/assets/css/dashboard-student.css";
import { connect } from "react-redux";
import { clearErrors } from "../_store/slices/errorSlice";
// import ViewEvents from '../registration/view/events.jsx';

var currentView = null;

/*
 * @author: Daniel Bell
 */

function StudentDash(props)
{
  //props.dispatchResetErrors();
  const [currentView, setCurrentView] = useState(<h2>Welcome to the Student Dashboard!</h2>); 
  

  return (
    <div>
        <Navbar inverse collapseOnSelect>
          <Navbar.Brand onClick={() => setCurrentView(<h2>Welcome to the Student Dashboard!</h2>)}>Student Portal</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav>
              <NavDropdown title="Show" id="basic-nav-dropdown">
                <NavItem onClick={() => setCurrentView(<ViewQuestions />)}>
                  Questions
                </NavItem>
                <NavItem onClick={() => setCurrentView(<ViewEvents />)}>
                  Events
                </NavItem>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className="page-body">
          <StatusMessages />
          {currentView}
        </div>
      </div>
  );
}

StudentDash.defaultProps = {
  dispatchResetErrors: () => mapDispatchToProps,
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchResetErrors: () => dispatch(clearErrors()),
  };
};

export default connect(null,mapDispatchToProps)(StudentDash);
