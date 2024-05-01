/**
 * Dashboard for Advisors
 * Author:
 * Modified: 5/1/2024
 */
import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import StatusMessages from "../_common/components/status-messages.jsx";
import DashboardHome from "../home/dashboard-home"
import AdvisorTeamsView from "../registration/view/advisor-teams";
import ViewEvents from "../registration/view/events";
import CreateTeam from "../registration/create/team";
import "../_common/assets/css/public-dashboard.css";
import AddStudent from "../registration/create/high-school-student.jsx";
import ViewStudents from "../registration/view/high-school-students.jsx";
import { connect } from "react-redux";
import { clearErrors } from "../_store/slices/errorSlice.js";

/**
 * Returns a react component that renders the Advisor dashboard
 */
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
              <NavDropdown.Item onClick={() => setCurrentView(<AddStudent advisorUser={props.currentUser.id} setCurrentView={setCurrentView} />)}>
                Create Student
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Teams">
              <NavDropdown.Item onClick={() => setCurrentView(<AdvisorTeamsView advisor={props.currentUser} setCurrentView={setCurrentView}/>)}>
                View Teams
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setCurrentView(<CreateTeam advisor={props.currentUser} />)}>
                Create Team
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Events" align="end" flip>
              <NavDropdown.Item onClick={() => setCurrentView(<ViewEvents />)}>
                View Published Events
              </NavDropdown.Item>
            </NavDropdown>
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

/**
 * Redux initializes props.
 */
const mapStateToProps = (state) => {
  return { 
    currentUser: state.auth.user,
    errors: state.errors
  };
};

/**
 * Redux updates props.
 */
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchResetErrors: () => dispatch(clearErrors()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdvisorDash);
