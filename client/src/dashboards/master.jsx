/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { useState, useEffect} from "react";
import { Navbar, NavItem, Nav, NavDropdown } from "react-bootstrap";
import { connect } from "react-redux";
import StatusMessages from "../_common/components/status-messages/status-messages.jsx";
import DashboardHome from "../home/dashboard-home"
//import Email from "../email/create-email";
import EventSignIn from "../registration/create/event-signin";
import CreateEvent from "../registration/create/event";
//import CreateNews from "../home/news";
import ViewEvents from "../registration/view/events";
import ViewUsers from "../registration/view/users";
import SchoolRequests from "../registration/view/advisor-school-requests"
import ViewTeams from "../registration/view/teams";
import Register from "../registration/create/user";
import CreateTeam from "../registration/create/manage-team";
//import Scoreboard from "../scoring/scoreboard.jsx";
//import PublishPractice from "../problems/practice";
//import PublishScores from "../scoring/scores";
import "../_common/assets/css/register-user.css";
import "../_common/assets/css/dashboard-master.css";
import RegisterSchool from "../registration/create/school";
import ViewSchools from "../registration/view/school";
// import TeamRequests from "../registration/view/team-requests.jsx";
import { clearErrors } from "../_store/slices/errorSlice.js";

/*
 * @author: Daniel Bell, Tyler Trammell
 */

function MasterDash(props)
{
  const [currentView, setCurrentView] = useState(<DashboardHome user={props.currentUser} />);

  useEffect(() =>{
    props.dispatchResetErrors();
    }, [props]);

return(
  <div>
        <Navbar>
          <Nav>
            <Nav.Link onClick={() => setCurrentView(<DashboardHome user={props.currentUser} />)}>
              Master Portal
            </Nav.Link>
          </Nav>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav>
              <NavDropdown title="Users" id="basic-nav-dropdown">
                <NavItem onClick={() => setCurrentView(<Register />)}>
                  Create User
                </NavItem>
                <NavItem onClick={() => setCurrentView(<ViewUsers />)}>
                  View Users
                </NavItem>
                <NavItem eventKey={3} onClick={() => setCurrentView(<SchoolRequests />)}>
                  School Requests
                </NavItem>
              </NavDropdown>

              <NavDropdown title="Schools" id="basic-nav-dropdown">
                <NavItem onClick={() => setCurrentView(<RegisterSchool />)}>
                  Create School
                </NavItem>
                <NavItem onClick={() => setCurrentView(<ViewSchools />)}>
                  View Schools
                </NavItem>
              </NavDropdown>

              <NavDropdown title="Teams" id="basic-nav-dropdown">
                {/* <NavItem onClick={() => setCurrentView(<TeamRequests />)}>
                  Team Request
                </NavItem> */}
                <NavItem onClick={() => setCurrentView(<CreateTeam advisor={props.currentUser} />)}>
                  Create Team
                </NavItem>
                <NavItem onClick={() => setCurrentView(<ViewTeams />)}>
                  View Teams
                </NavItem>
              </NavDropdown>

              <NavDropdown title="Events" id="basic-nav-dropdown">
                <NavItem onClick={() => setCurrentView(<EventSignIn />)}>
                  Begin Event
                </NavItem>
                <NavItem onClick={() => setCurrentView(<CreateEvent />)}>
                  Create Event
                </NavItem>
                <NavItem onClick={() => setCurrentView(<ViewEvents />)}>
                  View Events
                </NavItem>
              </NavDropdown>

              {/* <NavDropdown title="Scoreboard" id="basic-nav-dropdown">
                <NavItem onClick={() => setCurrentView(<Scoreboard />)}>
                  View Board
                </NavItem>
              </NavDropdown> */}

              {/* <NavDropdown title="Resources" id="basic-nav-dropdown">
                <NavItem onClick={() => setCurrentView(<PublishPractice />)}>
                  Publish Practice Questions
                </NavItem>
                <NavItem onClick={() => setCurrentView(<PublishScores />)}>
                  Publish Scorecards
                </NavItem>
                <NavItem onClick={() => setCurrentView(<Email />)}>
                  Create Email Alert
                </NavItem>
                <NavItem onClick={() => setCurrentView(<CreateNews />)}>
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
)
}

//Maps the states to props to be used in connect wrapper in export
const mapStateToProps = (state) => {
	return {
		currentUser: state.auth.user,
		errors: state.errors,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		dispatchResetErrors: () => dispatch(clearErrors()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MasterDash);
