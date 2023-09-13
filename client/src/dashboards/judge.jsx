/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React, { Component } from "react";
import { Navbar, NavItem, Nav, NavDropdown, Jumbotron } from "react-bootstrap";
import StatusMessages from "../_common/components/status-messages/status-messages.jsx";
import EventSignIn from "../registration/create/event-signin";
import ViewEvents from "../registration/view/events";
import ViewUsers from "../registration/view/users";
import ViewTeams from "../registration/view/teams";
import ViewAssignVolunteers from "../judging/assignVolunteersBoard";
import EditScores from "../judging/editScores";
import EditQuestions from "../judging/editQuestions";
import Scoreboard from "../scoring/scoreboard";
import UserService from "../_common/services/user";
import "../_common/assets/css/register-user.css";
import "../_common/assets/css/dashboard-admin.css";
import { connect } from "react-redux";
import Websocket from "react-websocket";
import { CLEAR_ERRORS } from "../_store/actions/types.js";

const URL = "ws://localhost:8000";
var currentView = "";

/*
 * @author: Daniel Bell, Tyler Trammell
 * @edited by: Caleb Logan
 */
class JudgeDash extends Component {
  constructor(props) {
    super(props);
    this.currentView = null;
    this.props.dispatchResetErrors();
    this.state = {
      userTable: [],
      eventTable: [],
    };
  }

   ws = new WebSocket(URL);

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
   * Returns a JSON message of all registered teams. Helper function needed to generate this data as a table.
   */
  handleShowTeams = () => {
    currentView = <ViewTeams />;
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
   * Shows a table of all teams and allows the user to mark whether the team is present.
   */
  handleEventSignIn = () => {
    currentView = <EventSignIn />;
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
   *   Sets the current view to render the View Assign Volunteers component
   */
  handleViewAssignVolunteers = () => {
    currentView = <ViewAssignVolunteers />;
    this.forceUpdate();
  };

  /*
   * Resets the currentView property to the default.
   */
  handleShowDefault = () => {
    currentView = (
      <h2 id="welcome">
        {" "}
        {this.currentUserName.FirstName} {this.currentUserName.LastName}!
      </h2>
    );
    this.forceUpdate();
  };

  handleShowJudging = () => {
    currentView = <EditScores />;
    this.forceUpdate();
  };

  handleShowQuestions = () => {
    currentView = <EditQuestions />;
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
              Judge Portal
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavDropdown title="View" id="basic-nav-dropdown">
                <NavItem eventKey={1} onClick={this.handleShowUsers}>
                  Active Users
                </NavItem>
                <NavItem eventKey={2} onClick={this.handleShowTeams}>
                  Active Teams
                </NavItem>
                <NavItem eventKey={3} onClick={this.handleShowEventHistory}>
                  Event Schedule
                </NavItem>
                <NavItem eventKey={6} onClick={this.handleViewAssignVolunteers}>
                  Assign Volunteers
                </NavItem>
              </NavDropdown>
              <NavItem eventKey={4} onClick={this.handleEventSignIn}>
                Begin Event
              </NavItem>
              <NavItem eventKey={8} onClick={this.handleShowJudging}>
                Judging
              </NavItem>
              <NavItem eventKey={7} onClick={this.handleShowQuestions}>
                Questions
              </NavItem>
              <NavItem eventKey={5} onClick={this.handleShowScore}>
                View Board
              </NavItem>
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
  return { currentUser: state.auth.user };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchResetErrors: () => dispatch({ type: CLEAR_ERRORS }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(JudgeDash);
