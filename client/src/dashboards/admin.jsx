/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { useState, useEffect } from "react";
import { Navbar, NavItem, Nav, NavDropdown } from "react-bootstrap";
import StatusMessages from "../_common/components/status-messages/status-messages.jsx";
import AddEventTeam from "../registration/create/add-event-team";
import BoardSetup from "../scoring/create-scoreboard";
import Email from "../email/create-email";
import EventSignIn from "../registration/create/event-signin";
import CreateEvent from "../registration/create/event";
import CreateNews from "../home/news";
import ViewEvents from "../registration/view/events";
import ViewUsers from "../registration/view/users";
import ViewTeams from "../registration/view/teams";
import UpgradeRequests from "../registration/view/upgrade-requests";
import AddUser from "../registration/create/add-team-member";
import Register from "../registration/create/user";
import RegisterTeam from "../registration/create/team";
import Scoreboard from "../scoring/scoreboard.jsx";
import PublishPractice from "../problems/practice";
import PublishScores from "../scoring/scores";
import UserService from "../_common/services/user";
import "../_common/assets/css/register-user.css";
import "../_common/assets/css/dashboard-admin.css";
import RegisterSchool from "../registration/create/school";
import ViewSchools from "../registration/view/school";
import ViewAdvisors from "../registration/view/advisors";
import { connect } from "react-redux";
import { clearErrors } from "../_store/slices/errorSlice.js";

function AdminDash(props)
{
  const [currentView, setCurrentView] = useState(<></>);
  const [currentUserName, setCurrentUserName] = useState({FirstName: "", LastName:"",});

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
  
  return (
    <div>
      <Navbar inverse collapseOnSelect>
          <Navbar.Brand onClick={() => setCurrentView(<h2 id="welcome">Welcome {currentUserName.FirstName} {currentUserName.LastName}!</h2>)}>
            Admin Portal
          </Navbar.Brand>
          <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav>
            <NavDropdown title="Users" id="basic-nav-dropdown">
              <NavItem eventKey={1} onClick={() => setCurrentView(<UpgradeRequests />)}>
                Upgrade Requests
              </NavItem>
              <NavItem eventKey={2} onClick={() => setCurrentView(<Register />)}>
                Create User
              </NavItem>
              <NavItem eventKey={3} onClick={() => setCurrentView(<ViewUsers />)}>
                View Users
              </NavItem>
              <NavItem eventKey={19} onClick={() => setCurrentView(<ViewAdvisors />)}>
                View Advisors
              </NavItem>
            </NavDropdown>

            <NavDropdown title="Schools" id="basic-nav-dropdown">
              <NavItem eventKey={17} onClick={() => setCurrentView(<RegisterSchool />)}>
                Create School
              </NavItem>
              <NavItem eventKey={18} onClick={() => setCurrentView(<ViewSchools />)}>
                View Schools
              </NavItem>
            </NavDropdown>

            <NavDropdown title="Teams" id="basic-nav-dropdown">
              <NavItem eventKey={4} onClick={() => setCurrentView(<RegisterTeam />)}>
                Create Team
              </NavItem>
              <NavItem eventKey={5} onClick={() => setCurrentView(<AddUser />)}>
                Add User
              </NavItem>
              <NavItem eventKey={6} onClick={() => setCurrentView(<ViewTeams />)}>
                View Teams
              </NavItem>
            </NavDropdown>

            <NavDropdown title="Events" id="basic-nav-dropdown">
              <NavItem eventKey={7} onClick={() => setCurrentView(<EventSignIn />)}>
                Begin Event
              </NavItem>
              <NavItem eventKey={9} onClick={() => setCurrentView(<CreateEvent />)}>
                Create Event
              </NavItem>
              <NavItem eventKey={10} onClick={() => setCurrentView(<ViewEvents />)}>
                View Events
              </NavItem>
            </NavDropdown>

            <NavDropdown title="Scoreboard" id="basic-nav-dropdown">
              <NavItem eventKey={11} onClick={() => setCurrentView(<Scoreboard />)}>
                View Board
              </NavItem>
            </NavDropdown>

            <NavDropdown title="Resources" id="basic-nav-dropdown">
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
            </NavDropdown>
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
