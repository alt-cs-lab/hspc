/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { useState, useEffect} from "react";
import { Navbar, NavItem, Nav, NavDropdown } from "react-bootstrap";
import { connect } from "react-redux";
import StatusMessages from "../_common/components/status-messages/status-messages.jsx";

import Email from "../email/create-email";
import EventSignIn from "../registration/create/event-signin";
import CreateEvent from "../registration/create/event";
import CreateNews from "../home/news";
import ViewEvents from "../registration/view/events";
import ViewUsers from "../registration/view/users";
import ViewTeams from "../registration/view/teams";
import UpgradeRequests from "../registration/view/upgrade-requests";
import Register from "../registration/create/user";
import CreateTeam from "../registration/create/manage-team";
import Scoreboard from "../scoring/scoreboard.jsx";
import PublishPractice from "../problems/practice";
import PublishScores from "../scoring/scores";
import UserService from "../_common/services/user";
import "../_common/assets/css/register-user.css";
import "../_common/assets/css/dashboard-master.css";
import RegisterSchool from "../registration/create/school";
import ViewSchools from "../registration/view/school";
import TeamRequests from "../registration/view/team-requests.jsx";
import { clearErrors } from "../_store/slices/errorSlice.js";

/*
 * @author: Daniel Bell, Tyler Trammell
 */

function MasterDash(props)
{
  const [currentUserName, setCurrentUserName] = useState({ FirstName: "", LastName: ""});
  const [currentView, setCurrentView] = useState(<></>);
  // TODO TWP: NOT SURE WHAT THIS DOES const [state, setCurrentState] = useState({userTable: [], eventTable: [],});
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
