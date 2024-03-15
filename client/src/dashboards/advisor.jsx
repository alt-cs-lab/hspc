/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React, { useState, useEffect } from "react";
import { Navbar, NavItem, Nav, NavDropdown/*, NavLink*/ } from "react-bootstrap";
import StatusMessages from "../_common/components/status-messages/status-messages.jsx";
import TeamsView from "../registration/advisor/teams-view";
import ViewEvents from "../registration/view/events";
import CreateTeam from "../registration/create/manage-team";
//import Scoreboard from "../scoring/scoreboard.jsx";
import "../_common/assets/css/register-user.css";
import "../_common/assets/css/dashboard-admin.css";
import AddStudent from "../registration/create/add-high-school-student.jsx";
import ViewStudents from "../registration/view/high-school-students.jsx";
import { connect } from "react-redux";
import { clearErrors } from "../_store/slices/errorSlice.js";

function AdvisorDash (props)
{ 
  const [currentView, setCurrentView] = useState(<h2 id="welcome">Welcome {props.currentUser.name}!</h2>);

  useEffect(() =>{
    props.dispatchResetErrors();
  }, [props]);

  return (
    <>
      <Navbar inverse collapseOnSelect>
          <Nav>
            <Nav.Link onClick={() => setCurrentView(<h2 id="welcome">Welcome {props.currentUser.name}!</h2>)}>
              Advisor Portal
            </Nav.Link>
          </Nav>
          <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav>
            <NavDropdown title="Students" id="basic-nav-dropdown">
              <NavItem eventKey={7} onClick={() => setCurrentView(<ViewStudents advisorUser={props.currentUser.id}/>)}>
                View Students
              </NavItem>
              <NavItem eventKey={7} onClick={() => setCurrentView(<AddStudent advisorUser={props.currentUser.id}/>)}>
                Create Student
              </NavItem>
            </NavDropdown>
            <NavDropdown title="Teams" id="basic-nav-dropdown">
              <NavItem eventKey={1} onClick={() => setCurrentView(<CreateTeam advisor={props.currentUser} />)}>
                Create Team
              </NavItem>
              <NavItem eventKey={3} onClick={() => setCurrentView(<TeamsView advisor={props.currentUser} />)}>
                View Teams
              </NavItem>
            </NavDropdown>
            <NavDropdown title="Events" id="basic-nav-dropdown">
              <NavItem eventKey={5} onClick={() => setCurrentView(<ViewEvents />)}>
                View Events
              </NavItem>
            </NavDropdown>
            {/* <NavLink eventKey={6} onClick={() => setCurrentView(<Scoreboard />)}>
              View Board
            </NavLink> */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="page-body">
        <StatusMessages />
        {currentView}
      </div>
    </>
  );  
}

//Maps the states to props to be used in connect wrapper in export
const mapStateToProps = (state) => {
  return { currentUser: state.auth.user };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchResetErrors: () => dispatch(clearErrors()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdvisorDash);
