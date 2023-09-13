/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React, { Component } from "react";
import { Navbar, NavItem, Nav, NavDropdown, Jumbotron } from "react-bootstrap";
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
import { CLEAR_ERRORS } from "../_store/actions/types.js";

var currentView = null;

/*
 * @author: Daniel Bell, Tyler Trammell
 */
class AdvisorDash extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.currentView = null;
    this.advisors = null;
    this.state = {
      userTable: [],
      eventTable: [],
    };
  }

  /*
   * Returns the first name, last name, and ID of the current user.
   */
  componentDidMount = () => {
    /* var users = [];
        UserService.getAllUsers()
            .then((response) => {
                let data = JSON.parse(response.body);
                data.forEach((user, index) => {
                    if (user.AccessLevel === '60') {
                        users.push({
                            id: index,
                            FirstName: user.FirstName,
                            LastName: user.LastName
                        });
                    }
                    if (user.Email === this.currentUser) {
                        this.currentUserName = {
                            FirstName: user.FirstName,
                            LastName: user.LastName
                        };
                    }
                });
                this.advisors = users;
                this.handleShowDefault();
            })
            .catch(() => {
                console.log("No users fonund");
            }) */
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
                AdvisorID: body[i].userid,
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
   * Renders the RegisterTeam.jsx component. Prompts the user to create a new team.
   */
  handleCreateTeam = () => {
    currentView = <RegisterTeam advisor={this.currentUser} />;
    this.forceUpdate();
  };

  /*
   * Renders the AddUser.jsx component. Prompts the user to a new team member or update their information.
   * BUG: passing in this.currentUser changed to this.props.currentUser - Natalie Laughlin
   */
  handleAddToTeam = () => {
    currentView = (
      <AddUser
        advisor={this.props.currentUser} //was not passing in the currentUser Fixed Natalie Laughlin
      />
    );
    this.forceUpdate();
  };

  /*
   * Returns a JSON message of all registered teams. Helper function needed to generate this data as a table.
   * BUG: passing in this.currentUser changed to this.props.currentUser - Natalie Laughlin
   */
  handleShowTeams = () => {
    currentView = <ViewTeams advisor={this.props.currentUser} />;
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
   * Returns a JSON message of all registered users. Helper function needed to generate this data as a table.
   */
  handleShowUsers = () => {
    currentView = <ViewUsers />;
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
   * Binds a registered team to a specific event.
   */
  handleAddTeamToEvent = () => {
    currentView = <AddEventTeam advisor={this.currentUser} />;
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
   * Returns a JSON message of all scheduled events. Helper function needed to generate this data as a table.
   */
  handleAddSchoolAdvisor = () => {
    currentView = (
      <AddSchoolAdvisor advisorUser={this.currentUserName.AdvisorID} />
    );
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
              Advisor Portal
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavDropdown title="School" id="basic-nav-dropdown">
                <NavItem eventKey={7} onClick={this.handleAddSchoolAdvisor}>
                  Add Your School
                </NavItem>
              </NavDropdown>
              <NavDropdown title="Teams" id="basic-nav-dropdown">
                <NavItem eventKey={1} onClick={this.handleCreateTeam}>
                  Register Team
                </NavItem>
                <NavItem eventKey={2} onClick={this.handleAddToTeam}>
                  Add User
                </NavItem>
                <NavItem eventKey={3} onClick={this.handleShowTeams}>
                  View Teams
                </NavItem>
              </NavDropdown>
              <NavDropdown title="Events" id="basic-nav-dropdown">
                <NavItem eventKey={5} onClick={this.handleShowEventHistory}>
                  View Events
                </NavItem>
              </NavDropdown>
              <NavItem eventKey={6} onClick={this.handleShowScore}>
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

export default connect(mapStateToProps, mapDispatchToProps)(AdvisorDash);
