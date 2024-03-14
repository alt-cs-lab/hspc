/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React, { useState, useEffect } from "react";
import { Navbar, NavItem, Nav, NavDropdown, NavLink } from "react-bootstrap";
import StatusMessages from "../_common/components/status-messages/status-messages.jsx";
import UserService from "../_common/services/user";
import TeamsView from "../registration/advisor/teams-view";
import ViewEvents from "../registration/view/events";
import CreateTeam from "../registration/create/manage-team";
import Scoreboard from "../scoring/scoreboard.jsx";
import "../_common/assets/css/register-user.css";
import "../_common/assets/css/dashboard-admin.css";
import AddStudent from "../registration/create/add-high-school-student.jsx";
import ViewStudents from "../registration/view/high-school-students.jsx";
import { connect } from "react-redux";
import { clearErrors } from "../_store/slices/errorSlice.js";

function AdvisorDash (props)
{ 
  const [currentUserName, setCurrentUserName] = useState({FirstName: "", LastName: "", AdvisorID:0,})
  const [currentView, setCurrentView] = useState(<h2 id="welcome">Welcome {currentUserName.FirstName} {currentUserName.LastName}!</h2>);

  useEffect(() =>{
    props.dispatchResetErrors();
    UserService.getAllUsers()
      .then((response) => {
        let body = response.data;
        if (response.status === 200) {
          let user = [];
          for (let i = 0; i < body.length; i++) {
            if (body[i].email === props.currentUser.email) {
              user = {
                FirstName: body[i].firstname,
                LastName: body[i].lastname,
                AdvisorID: body[i].userid,
              };
            }
          }
          setCurrentUserName(user);
          setCurrentView(<h2 id="welcome">Welcome {user.FirstName} {user.LastName}!</h2>)
        }
      })
      .catch((resErr) => {
        console.log("Error: ", resErr);
      });
  }, [props]);

  return (
    <>
      <Navbar inverse collapseOnSelect>
          <Nav>
            <Nav.Link onClick={() => setCurrentView(<h2 id="welcome">Welcome {currentUserName.FirstName} {currentUserName.LastName}!</h2>)}>
              Advisor Portal
            </Nav.Link>
          </Nav>
          <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav>
            <NavDropdown title="Students" id="basic-nav-dropdown">
              <NavItem eventKey={7} onClick={() => setCurrentView(<ViewStudents advisorUser={currentUserName.AdvisorID}/>)}>
                View Students
              </NavItem>
              <NavItem eventKey={7} onClick={() => setCurrentView(<AddStudent advisorUser={currentUserName.AdvisorID}/>)}>
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
            <NavLink eventKey={6} onClick={() => setCurrentView(<Scoreboard />)}>
              View Board
            </NavLink>
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
