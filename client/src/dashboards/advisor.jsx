/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React, { useState, useEffect } from "react";
import { Navbar, NavItem, Nav, NavDropdown/*, NavLink*/ } from "react-bootstrap";
import StatusMessages from "../_common/components/status-messages.jsx";
import DashboardHome from "../home/dashboard-home"
import TeamsView from "../registration/advisor/teams-view";
import ViewEvents from "../registration/view/events";
import CreateTeam from "../registration/create/manage-team";
//import Scoreboard from "../scoring/scoreboard.jsx";
import "../_common/assets/css/public-dashboard.css";
import AddStudent from "../registration/create/add-high-school-student.jsx";
import ViewStudents from "../registration/view/high-school-students.jsx";
import { connect } from "react-redux";
import { clearErrors } from "../_store/slices/errorSlice.js";

function AdvisorDash (props)
{ 
  const [currentView, setCurrentView] = useState(<DashboardHome user={props.currentUser} />);

  useEffect(() =>{
    props.dispatchResetErrors();
  }, [props]);

  return (
    <>
      <Navbar expand='lg' inverse collapseOnSelect>
          <Nav>
            <Nav.Link onClick={() => setCurrentView(<DashboardHome user={props.currentUser} />)}>
              Advisor Portal
            </Nav.Link>
          </Nav>
          <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav>
            <NavDropdown title="Students">
              <NavDropdown.Item onClick={() => setCurrentView(<ViewStudents advisorUser={props.currentUser.id} setCurrentView={setCurrentView} />)}>
                View Students
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setCurrentView(<AddStudent advisorUser={props.currentUser.id} />)}>
                Create Student Test
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Teams">
              <NavDropdown.Item onClick={() => setCurrentView(<TeamsView advisor={props.currentUser} setCurrentView={setCurrentView}/>)}>
                View Teams
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setCurrentView(<CreateTeam advisor={props.currentUser} />)}>
                Create Team
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Events">
              <NavDropdown.Item onClick={() => setCurrentView(<ViewEvents />)}>
                View Events
              </NavDropdown.Item>
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
