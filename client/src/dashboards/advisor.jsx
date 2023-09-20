/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React, { Component, useState, useEffect } from "react";
import { Navbar, NavItem, Nav, NavDropdown } from "react-bootstrap";
import StatusMessages from "../_common/components/status-messages/status-messages.jsx";
import UserService from "../_common/services/user";
import ViewUsers from "../registration/view/users";
import ViewTeams from "../registration/view/teams";
import ViewEvents from "../registration/view/events";
import AddUser from "../registration/create/add-team-member";
import AddEventTeam from "../registration/create/add-event-team";
import RegisterTeam from "../registration/create/team";
import Scoreboard from "../scoring/scoreboard.jsx";
import "../_common/assets/css/register-user.css";
import "../_common/assets/css/dashboard-admin.css";
import AddSchoolAdvisor from "../registration/create/add-school-advisors";
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
        let body = response.body;
        if (response.statusCode === 200) {
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
        console.log("Error: ",resErr);
      });
  }, [props]);

  
  return (
    <div>
      <Navbar inverse collapseOnSelect>
          <Navbar.Brand onClick={() => setCurrentView(<h2 id="welcome">Welcome {currentUserName.FirstName} {currentUserName.LastName}!</h2>)}>
            Advisor Portal
          </Navbar.Brand>
          <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav>
            <NavDropdown title="School" id="basic-nav-dropdown">
              <NavItem eventKey={7} onClick={() => setCurrentView(<AddSchoolAdvisor advisorUser={currentUserName.AdvisorID} />)}>
                Add Your School
              </NavItem>
            </NavDropdown>
            <NavDropdown title="Teams" id="basic-nav-dropdown">
              <NavItem eventKey={1} onClick={() => setCurrentView(<RegisterTeam advisor={props.currentUser} />)}>
                Register Team
              </NavItem>
              <NavItem eventKey={2} onClick={() => setCurrentView(<AddUser advisor={props.currentUser} />)}>
                Add User
              </NavItem>
              <NavItem eventKey={3} onClick={() => setCurrentView(<ViewTeams advisor={props.currentUser} />)}>
                View Teams
              </NavItem>
            </NavDropdown>
            <NavDropdown title="Events" id="basic-nav-dropdown">
              <NavItem eventKey={5} onClick={() => setCurrentView(<ViewEvents />)}>
                View Events
              </NavItem>
            </NavDropdown>
            <NavItem eventKey={6} onClick={() => setCurrentView(<Scoreboard />)}>
              View Board
            </NavItem>
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
