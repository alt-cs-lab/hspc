/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { useState, useEffect} from "react";
import { Navbar, NavItem, Nav, NavDropdown } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import StatusMessages from "../_common/components/status-messages/status-messages.jsx";

import AddEventTeam from "../unused/addEventTeam/add-event-team.jsx";
import BoardSetup from "../pages/events/beginEvent/create-scoreboard.jsx";
import Email from "../pages/resources/createEmailAlert/create-email";
import EventSignIn from "../pages/events/beginEvent/event-signin.jsx";
import CreateEvent from "../pages/events/createEvent/event.jsx";
import CreateNews from "../pages/resources/updateNewsfeed/news.jsx";
import ViewEvents from "../pages/events/ViewEvents/events.jsx";
import ViewUsers from "../pages/users/viewUsers/users.jsx";
import ViewTeams from "../pages/teams/viewTeams/teams.jsx";
import UpgradeRequests from "../pages/users/upgradeRequests/upgrade-requests.jsx";
import AddUser from "../pages/teams/addUser/add-team-member.jsx";
import Register from "../pages/users/createUser/user.jsx";
import RegisterTeam from "../pages/teams/createTeam/team.jsx";
import Scoreboard from "../pages/scoreboard/viewBoard/scoreboard.jsx";
import PublishPractice from "../pages/resources/publishPracticeQuestions/practice";
import PublishScores from "../pages/resources/publishScorecards/scores";
import UserService from "../_common/services/user";
import "../_common/assets/css/register-user.css";
import "../_common/assets/css/dashboard-master.css";
import RegisterSchool from "../pages/schools/createSchool/school";
import ViewSchools from "../pages/schools/viewSchools/school";
import ViewAdvisors from "../pages/users/viewAdvisors/advisors.jsx";
import TeamRequests from "../pages/teams/teamRequest/team-requests.jsx";
import { clearErrors } from "../_store/slices/errorSlice.js";

/*
 * @author: Daniel Bell, Tyler Trammell
 */

function MasterDash(props)
{
  const [currentUserName, setCurrentUserName] = useState({ FirstName: "", LastName: ""});
  const [currentView, setCurrentView] = useState(<></>);
  const [state, setCurrentState] = useState({userTable: [], eventTable: [],});
  const defaultView = <h2 id="welcome">Welcome {currentUserName.FirstName} {currentUserName.LastName}!</h2>;

  useEffect(() =>{
    props.dispatchResetErrors();
      UserService.getAllUsers()
      .then((response) => {
        let body = response.data
        if (response.status === 200) {
          let user = [];
          for (let i = 0; i < body.length; i++) {
            if (body[i].email === props.currentUser.email) {
              user = {
                FirstName: body[i].firstname,
                LastName: body[i].lastname,
              };
            }
          }
          setCurrentUserName(user);
          setCurrentView(<h2 id="welcome">Welcome {user.FirstName} {user.LastName}!</h2>)
        }
      })
      .catch((resErr) => {
        console.log("Error: ",resErr);
      })
    }, [props]);

   

return(
  <div>
        <Navbar>
          <Navbar.Brand onClick={() => setCurrentView(defaultView)}>
            Master Portal
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav>
              <NavDropdown title="Users" id="basic-nav-dropdown">
                <NavItem onClick={() => setCurrentView(<UpgradeRequests />)}>
                  Upgrade Requests
                </NavItem>
                <NavItem onClick={() => setCurrentView(<Register />)}>
                  Create User
                </NavItem>
                <NavItem onClick={() => setCurrentView(<ViewUsers />)}>
                  View Users
                </NavItem>
                <NavItem onClick={() => setCurrentView(<ViewAdvisors />)}>
                  View Advisors
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
                <NavItem onClick={() => setCurrentView(<TeamRequests />)}>
                  Team Request
                </NavItem>
                <NavItem onClick={() => setCurrentView(<RegisterTeam />)}>
                  Create Team
                </NavItem>
                <NavItem onClick={() => setCurrentView(<AddUser />)}>
                  Add User
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

              <NavDropdown title="Scoreboard" id="basic-nav-dropdown">
                <NavItem onClick={() => setCurrentView(<Scoreboard />)}>
                  View Board
                </NavItem>
              </NavDropdown>

              <NavDropdown title="Resources" id="basic-nav-dropdown">
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
              </NavDropdown>
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
