/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import { Navbar, NavItem, Nav, NavDropdown, Jumbotron } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
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
import "../_common/assets/css/dashboard-master.css";
import RegisterSchool from "../registration/create/school";
import ViewSchools from "../registration/view/school";
import ViewAdvisors from "../registration/view/advisors";
import TeamRequests from "../registration/view/team-requests.jsx";

import { logoutUser } from "../_store/actions/authActions";
import { CLEAR_ERRORS } from "../_store/actions/types.js";

var currentView = "";

/*
 * @author: Daniel Bell, Tyler Trammell
 */
class MasterDash extends Component {
  constructor(props) {
    super(props);
    this.currentView = null;
    this.props.dispatchResetErrors();
    this.state = {
      userTable: [],
      eventTable: [],
    };
  }

  /*
   * Finds the name of the current user and displays it.
   */
  componentDidMount = () => {
    UserService.getAllUsers()
      .then((response) => {
        let body = JSON.parse(response.body);
        if (response.statusCode === 200) {
          let user = [];
          for (let i = 0; i < body.length; i++) {
            if (body[i].email === this.props.currentUser.email) {
              user = {
                FirstName: body[i].firstname,
                LastName: body[i].lastname,
              };
            }
          }
          this.currentUserName = user;
          this.handleShowDefault();
        }
      })
      .catch((resErr) => {
        console.log("Something went wrong. Please try again");
      });
  };

  /*
   * Renders the Register.jsx component. Prompts the user to create a new user.
   */
  handleCreateUser = () => {
    currentView = <Register />;
    this.forceUpdate();
  };

  /*
   * Renders the team-request.jsx component. Prompts the user to create a new team.
   */
  handleTeamRequest = () => {
    currentView = <TeamRequests />;
    this.forceUpdate();
  };

  /*
   * Renders the team-request.jsx component. Prompts the user to create a new team.
   */
  handleCreateTeam = () => {
    currentView = <RegisterTeam />;
    this.forceUpdate();
  };

  /*
   * Renders the AddUser.jsx component. Prompts the user to a new team member or update their information.
   */
  handleAddToTeam = () => {
    currentView = <AddUser />;
    this.forceUpdate();
  };

  /*
   * Renders the AddUser.jsx component. Prompts the user to a new team member or update their information.
   */
  handleAddToTeam = () => {
    currentView = <AddUser />;
    this.forceUpdate();
  };

  /*
   * Returns a JSON message of all registered teams. Helper function needed to generate this data as a table.
   */
  handleShowTeams = () => {
    currentView = <ViewTeams />;
    this.forceUpdate();
  };

  /*
   * Renders the CreateEvent.jsx component. Prompts the user to create a new event.
   */
  handleCreateEvent = () => {
    currentView = <CreateEvent />;
    this.forceUpdate();
  };

  /*
   * Renders the Scoreboard.jsx component. Only available to users with an access level of >3 by default.
   */
  handleShowScore = () => {
    currentView = <Scoreboard />;
    this.forceUpdate();
  };

  /*
   * IN PROGRESS
   * Renders the Email.jsx component. Only available to users with an access level of >3 by default.
   */
  handleCreateEmail = () => {
    currentView = <Email />;
    this.forceUpdate();
  };
  /*
   * IN PROGRESS
   * Renders the BoardSetup.jsx component. Only available to users with an access level of >=3 by default.
   */
  handleEditBoard = () => {
    currentView = <BoardSetup />;
    this.forceUpdate();
  };

  /*
   * Publishes a new newsletter component to the home page.
   */
  handleCreateNews = () => {
    currentView = <CreateNews />;
    this.forceUpdate();
  };

  /*
   * Renders the PublishPractice.jsx component. Only available to users with an access level of >=4 by default.
   */
  handlePublishPractice = () => {
    currentView = <PublishPractice />;
    this.forceUpdate();
  };

  /*
   * Renders the PublishScores.jsx component. Only available to users with an access level of >=4 by default.
   */
  handlePublishScores = () => {
    currentView = <PublishScores />;
    this.forceUpdate();
  };

  /*
   * Shows a table of all teams and allows the user to mark whether the team is present.
   */
  handleEventSignIn = () => {
    currentView = <EventSignIn />;
    this.forceUpdate();
  };

  /*
   * Shows outstanding requests for a higher level accounts.
   */
  handlePendingRequests = () => {
    currentView = <UpgradeRequests />;
    this.forceUpdate();
  };

  /*
   * Returns a JSON message of all registered users. Helper function needed to generate this data as a table.
   */
  handleShowUsers = () => {
    currentView = <ViewUsers />;
    this.forceUpdate();
  };

  /*
   * Returns a JSON message of all scheduled events. Helper function needed to generate this data as a table.
   */
  handleShowEventHistory = () => {
    currentView = <ViewEvents />;
    this.forceUpdate();
  };

  /*
   * Allows the user to register specific teams to scheduled events.
   */
  handleAddTeamToEvent = () => {
    currentView = <AddEventTeam />;
    this.forceUpdate();
  };

  /*
   * Resets the currentView property to the default.
   */
  handleShowDefault = () => {
    currentView = (
      <h2 id="welcome">
        Welcome {this.currentUserName.FirstName} {this.currentUserName.LastName}
        !
      </h2>
    );
    this.forceUpdate();
  };

  /*
   * Renders the RegisterSchool.jsx component. Prompts the user to create a new school.
   */
  handleCreateSchool = () => {
    currentView = <RegisterSchool />;
    this.forceUpdate();
  };

  /*
   * Returns a JSON message of all registered schools. Helper function needed to generate this data as a table.
   */
  handleShowSchools = () => {
    currentView = <ViewSchools />;
    this.forceUpdate();
  };

  /*
   * Returns a JSON message of all registered advisors. Helper function needed to generate this data as a table.
   */
  handleShowAdvisors = () => {
    currentView = <ViewAdvisors />;
    this.forceUpdate();
  };

  /*
   *  Renders the component UI.
   */
  render() {
    return (
      <div>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand onClick={this.handleShowDefault}>
              Master Portal
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavDropdown title="Users" id="basic-nav-dropdown">
                <NavItem eventKey={1} onClick={this.handlePendingRequests}>
                  Upgrade Requests
                </NavItem>
                <NavItem eventKey={2} onClick={this.handleCreateUser}>
                  Create User
                </NavItem>
                <NavItem eventKey={3} onClick={this.handleShowUsers}>
                  View Users
                </NavItem>
                <NavItem eventKey={19} onClick={this.handleShowAdvisors}>
                  View Advisors
                </NavItem>
              </NavDropdown>

              <NavDropdown title="Schools" id="basic-nav-dropdown">
                <NavItem eventKey={17} onClick={this.handleCreateSchool}>
                  Create School
                </NavItem>
                <NavItem eventKey={18} onClick={this.handleShowSchools}>
                  View Schools
                </NavItem>
              </NavDropdown>

              <NavDropdown title="Teams" id="basic-nav-dropdown">
                <NavItem eventKey={20} onClick={this.handleTeamRequest}>
                  Team Request
                </NavItem>
                <NavItem eventKey={4} onClick={this.handleCreateTeam}>
                  Create Team
                </NavItem>
                <NavItem eventKey={5} onClick={this.handleAddToTeam}>
                  Add User
                </NavItem>
                <NavItem eventKey={6} onClick={this.handleShowTeams}>
                  View Teams
                </NavItem>
              </NavDropdown>

              <NavDropdown title="Events" id="basic-nav-dropdown">
                <NavItem eventKey={7} onClick={this.handleEventSignIn}>
                  Begin Event
                </NavItem>
                <NavItem eventKey={9} onClick={this.handleCreateEvent}>
                  Create Event
                </NavItem>
                <NavItem eventKey={10} onClick={this.handleShowEventHistory}>
                  View Events
                </NavItem>
              </NavDropdown>

              <NavDropdown title="Scoreboard" id="basic-nav-dropdown">
                <NavItem eventKey={11} onClick={this.handleShowScore}>
                  View Board
                </NavItem>
              </NavDropdown>

              <NavDropdown title="Resources" id="basic-nav-dropdown">
                <NavItem eventKey={13} onClick={this.handlePublishPractice}>
                  Publish Practice Questions
                </NavItem>
                <NavItem eventKey={14} onClick={this.handlePublishScores}>
                  Publish Scorecards
                </NavItem>
                <NavItem eventKey={15} onClick={this.handleCreateEmail}>
                  Create Email Alert
                </NavItem>
                <NavItem eventKey={16} onClick={this.handleCreateNews}>
                  Update Newsfeed
                </NavItem>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Jumbotron className="page-body">
          <StatusMessages />
          {currentView}
        </Jumbotron>
      </div>
    );
  }
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
    dispatchResetErrors: () => dispatch({ type: CLEAR_ERRORS }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MasterDash);
