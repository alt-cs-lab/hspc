/**
 * Event sign-in page
 * Author:
 * Modified: 5/1/2024
 */
import React, { Component } from "react";
import { Table } from "react-bootstrap";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import BoardSetup from "../../scoring/create-scoreboard";
import AddScore from "../../_common/services/scoreboard";
import Scoreboard from "../../scoring/scoreboard";
import EventService from "../../_common/services/event";
// import "../../_common/assets/css/event-signin.css";
import TeamService from "../../_common/services/team";
import { connect } from "react-redux";
import {
  clearErrors,
  updateErrorMsg,
  updateSuccessMsg,
} from "../../_store/slices/errorSlice";

/*
 * @author: Daniel Bell
 * @MUdated: Natalie Laughlin
 */
class EventSignIn extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.pageView = null;
    this.dataView = null;
    this.selected = [];
    this.allTeams = [];
    this.presentTeams = [];
    this.eventDate = "";
    this.state = {
      eventList: [],
      teamList: [],
      redirect: false,
    };
  }

  /*
   * Returns a list of all events when the component is rendered.
   */
  componentDidMount = () => {
    // EventService.getAllEvents(
    //   this.props.auth.user.id,
    //   this.props.auth.user.accessLevel
    // )
    //   .then((response) => {
    //     if (response.ok) {
    //       let body = response.body;
    //       let events = [];
    //       for (let i = 0; i < body.length; i++) {
    //         events.push({
    //           label: body[i].eventdate,
    //           value: body[i].eventdate,
    //         });
    //       }
    //       this.setState({ eventList: events });
    //     } else console.log("An error has occurred, Please try again.");
    //   })
    //   .catch((resErr) => console.log("Something went wrong. Please try again"));

    /*
     * Get Events
     */
    EventService.getAllEvents(
      this.props.auth.user.id,
      this.props.auth.user.accessLevel
    )
      .then((response) => {
        if (response.ok) {
          let eventsbody = response.data;
          let events = [];
          for (let i = 0; i < eventsbody.length; i++) {
            events.push({
              label: eventsbody[i].name,
              value: eventsbody[i].id,
            });
          }
          this.setState({ eventList: events });
        } else
          console.log(
            "An error has occurred fetching events, Please try again."
          );
      })
      .catch((resErr) =>
        console.log("Something went wrong fetching events. Please try again")
      );
  };

  /*
   * Returns a list of teams matching the selected event date.
   */
  showRegisteredTeams = (date) => {
    this.eventDate = date;
    this.selected = [];
    TeamService.getAllTeamsInComp(this.eventDate)
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ teamList: response.body }, () => {
            this.generateSignInTable(); // helper function
          });
        } else console.log("An error has occurred, Please try again.");

        // populates the selected array with false values
        for (let i = 0; i < this.state.teamList.length; i++)
          this.selected.push(false);
      })
      .catch((resErr) =>
        console.log("Something went wrong. Please try again ", resErr)
      );
  };

  /*
   * Helper function for showRegisteredTeams. Generates the data as a table.
   */
  generateSignInTable() {
    const teams = [];
    this.state.teamList.forEach((team, index) => {
      teams.push(
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{team.teamname}</td>
          <td>{team.schoolname}</td>
          <td>{team.usdcode}</td>
          <td>{team.questionlevel}</td>
          <td>{team.email}</td>
          <td key={index}>
            <input
              type="checkbox"
              onClick={this.handleCheckboxClick}
              data-index={index}
            />
          </td>
        </tr>
      );
      this.allTeams.push(team); ///adding teams to the list Natalie Laughlin
    });
    this.dataView = (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Team Name</th>
            <th>School</th>
            <th>USD</th>
            <th>Level</th>
            <th>Advisor</th>
            <th>Arrived</th>
          </tr>
        </thead>
        <tbody>{teams}</tbody>
      </Table>
    );
    this.forceUpdate();
  }

  /*
   * Marks that a team has arrived.
   */
  handleCheckboxClick = (event) => {
    let index = event.target.getAttribute("data-index");
    if (this.selected[index] === false) this.selected[index] = true;
    else this.selected[index] = false;
    event.key = event.key + 1;
  };

  /*
   * Saves the information and updates the values in the database.
   */
  handleSaveChanges = () => {
    for (let i = 0; i < this.selected.length; i++) {
      if (this.selected[i] === true) this.presentTeams.push(this.allTeams[i]);
    }
    if (this.presentTeams.length >= 1) {
      //fill in the score table based on the info selected Natalie Laughlin
      for (let i = 0; i < this.presentTeams.length; i++) {
        AddScore.createEvent(this.eventDate, this.presentTeams[i].teamid)
          .then((response) => {
            if (response.statusCode === 200)
              this.props.dispatchSuccess("Sign in Successful.");
            else {
              console.log("here");
            }
          })
          .catch((resErr) =>
            this.props.dispatchError("Something went wrong. Please try again")
          );
        console.log("done");
      }

      this.setState({ redirect: true });
    }
  };

  /*
   * Renders the form and controls when to redirect to BoardSetup
   */
  renderRedirect = () => {
    if (!this.state.redirect) {
      this.pageView = (
        <div id="field">
          <h2>Event Sign In</h2>
          <p>
            <b>Please fill out the information below.</b>
          </p>
          <div id="sub-nav">
            <p id="sub-nav-item">
              <b>Event</b>
            </p>
            <Select
              placeholder="Select an Event"
              options={this.state.eventList}
              onChange={(e) => this.showRegisteredTeams(e.label)}
            />
          </div>
          {this.dataView}
          <div>
            <Button
              onClick={() => this.handleSaveChanges()}
            >
              Begin Event
            </Button>
          </div>
        </div>
      );
    } else {
      this.pageView = <BoardSetup presentTeams={this.presentTeams} />;
      this.pageView = <Scoreboard />; //Natalie Laughlin
      this.eventDate = "";
      this.presentTeams = [];
      this.selected = [];
    }
  };

  /*
   * Render the component UI
   */
  render() {
    return (
      <div>
        {this.renderRedirect()}
        {this.pageView}
      </div>
    );
  }
}

/**
 * Redux initializes props.
 */
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    errors: state.errors,
  };
};

/**
 * Redux updates props.
 */
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchResetErrors: () => dispatch(clearErrors()),
    dispatchError: (message) => dispatch(updateErrorMsg(message)),
    dispatchSuccess: (message) => dispatch(updateSuccessMsg(message)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventSignIn);
