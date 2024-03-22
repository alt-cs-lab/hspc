/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React, { useState, useEffect } from "react";
import { Navbar, NavItem, Nav, NavDropdown } from "react-bootstrap";
import StatusMessages from "../_common/components/status-messages.jsx";
import DashboardHome from "../home/dashboard-home"
import EventSignIn from "../registration/create/event-signin";
import ViewEvents from "../registration/view/events";
import ViewUsers from "../registration/view/users";
import ViewTeams from "../registration/view/teams";
import ViewAssignVolunteers from "../judging/assignVolunteersBoard";
import EditScores from "../judging/editScores";
import EditQuestions from "../judging/editQuestions";
//import Scoreboard from "../scoring/scoreboard";
import "../_common/assets/css/dashboard-home.css";
import { connect } from "react-redux";
//import Websocket from "react-websocket";
import { clearErrors } from "../_store/slices/errorSlice.js";

//const URL = "ws://localhost:8000";
//var currentView = "";
function JudgeDash(props)
{
  const [currentView, setCurrentView] = useState(<DashboardHome user={props.currentUser} />);
  //const ws = new WebSocket(URL);

  useEffect(() => {
    props.dispatchResetErrors();
  }, [props])

  return (
    <div>
      <Navbar inverse collapseOnSelect>
          <Nav>
            <Nav.Link onClick={() => setCurrentView(<DashboardHome user={props.currentUser} />)}>
              Judge Portal
            </Nav.Link>
          </Nav>
          <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav>
            <NavDropdown title="View" id="basic-nav-dropdown">
              <NavItem eventKey={1} onClick={() => setCurrentView(<ViewUsers />)}>
                Active Users
              </NavItem>
              <NavItem eventKey={2} onClick={() => setCurrentView(<ViewTeams />)}>
                Active Teams
              </NavItem>
              <NavItem eventKey={3} onClick={() => setCurrentView(<ViewEvents />)}>
                Event Schedule
              </NavItem>
              <NavItem eventKey={6} onClick={() => setCurrentView(<ViewAssignVolunteers />)}>
                Assign Volunteers
              </NavItem>
            </NavDropdown>
            <NavItem eventKey={4} onClick={() => setCurrentView(<EventSignIn />)}>
              Begin Event
            </NavItem>
            <NavItem eventKey={8} onClick={() => setCurrentView(<EditScores />)}>
              Judging
            </NavItem>
            <NavItem eventKey={7} onClick={() => setCurrentView(<EditQuestions />)}>
              Questions
            </NavItem>
            {/* <NavItem eventKey={5} onClick={() => setCurrentView(<Scoreboard />)}>
              View Board
            </NavItem> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(JudgeDash);
