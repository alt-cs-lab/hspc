/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import StatusMessages from "../_common/components/status-messages.jsx";
import DashboardHome from "../home/dashboard-home"
//import Email from "../email/create-email";
//import EventSignIn from "../registration/create/event-signin";
import CreateEvent from "../registration/create/event";
//import CreateNews from "../home/news";
import ViewEvents from "../registration/view/events";
import ViewEventsUnpublished from "../registration/view/events-unpublished.jsx"
import ViewUsers from "../registration/view/users";
import TeamRequests from "../registration/view/team-requests";
import SchoolRequests from "../registration/view/advisor-school-requests";
import ViewTeams from "../registration/view/teams";
import Register from "../registration/create/user";
import CreateTeam from "../registration/create/team";
//import Scoreboard from "../scoring/scoreboard.jsx";
//import PublishPractice from "../problems/practice";
//import PublishScores from "../scoring/scores";
import "../_common/assets/css/public-dashboard.css";
import RegisterSchool from "../registration/create/school";
import ViewSchools from "../registration/view/schools";
import { connect } from "react-redux";
import { clearErrors } from "../_store/slices/errorSlice.js";

function AdminDash(props)
{
  const [currentView, setCurrentView] = useState(<DashboardHome user={props.currentUser} />);

  useEffect(() =>{
    props.dispatchResetErrors();
    }, [props]);
  
  return (
    <div>
      <Navbar inverse collapseOnSelect>
          <Nav>
            <Nav.Link onClick={() => setCurrentView(<DashboardHome user={props.currentUser} />)}>
              Admin Portal
            </Nav.Link>
          </Nav>
          <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav>
              <NavDropdown title="Requests">
                <NavDropdown.Item onClick={() => setCurrentView(<TeamRequests />)}>
                  Team Requests
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => setCurrentView(<SchoolRequests />)}>
                  School Requests
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Users">
                <NavDropdown.Item onClick={() => setCurrentView(<Register />)}>
                  Create User
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => setCurrentView(<ViewUsers />)}>
                  View Users
                </NavDropdown.Item>
              </NavDropdown>

            <NavDropdown title="Schools">
              <NavDropdown.Item onClick={() => setCurrentView(<RegisterSchool />)}>
                Create School
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setCurrentView(<ViewSchools />)}>
                View Schools
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Teams">
              <NavDropdown.Item onClick={() => setCurrentView(<CreateTeam advisor={props.currentUser} />)}>
                Create Team
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setCurrentView(<ViewTeams />)}>
                View Teams
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Events" align="end" flip>
              {/*
              <NavDropdown.Item onClick={() => setCurrentView(<EventSignIn />)}>
                Begin Event
              </NavDropdown.Item>
              */}
              <NavDropdown.Item onClick={() => setCurrentView(<CreateEvent />)}>
                Create Event
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setCurrentView(<ViewEvents />)}>
                View Published Events
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setCurrentView(<ViewEventsUnpublished />)}>
                View Unpublished Events
              </NavDropdown.Item>
            </NavDropdown>

            {/* <NavDropdown title="Scoreboard" id="basic-nav-dropdown">
              <NavItem eventKey={11} onClick={() => setCurrentView(<Scoreboard />)}>
                View Board
              </NavItem>
            </NavDropdown> */}

            {/* <NavDropdown title="Resources" id="basic-nav-dropdown">
              <NavItem eventKey={13} onClick={() => setCurrentView(<PublishPractice />)}>
                Publish Practice Questions
              </NavItem>
              <NavItem eventKey={14} onClick={() => setCurrentView(<PublishScores />)}>
                Publish Scorecards
              </NavItem>
              <NavItem eventKey={15} onClick={() => setCurrentView(<Email />)}>
                Create Email Alert
              </NavItem>
              <NavItem eventKey={16} onClick={() => setCurrentView(<CreateNews />)}>
                Update Newsfeed
              </NavItem>
            </NavDropdown> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminDash);
