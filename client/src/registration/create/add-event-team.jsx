/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import { Table } from "react-bootstrap";
import Select from "react-select";
import Button from 'react-bootstrap/Button';
import TeamService from "../../_common/services/team";
import EventService from "../../_common/services/event";
import participantService from "../../_common/services/participant";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";

const styles = require('../../_utilities/styleConstants.js');

/*
 * @author: Daniel Bell, Trent Kempker
 */
class AddEventTeam extends Component {
  constructor(props) {
    super(props);
    this.currentView = null;
    this.eventDate = "";
    this.selected = [];
    this.AdvisorEmail = this.props.advisor;
    this.state = {
      teamTable: [],
      userTable: [],
      eventList: [],
    };
  }

  /*
   * Returns a list of all registered teams and events when the component is rendered.
   */
  componentDidMount = () => {
    this.eventDate = "";
    TeamService.getAllTeams()
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ teamTable: JSON.parse(response.body) }, () => {
            this.generateTeamTable(); // helper function
          });
        } else console.log("An error has occurred, Please try again.");

        EventService.getAllEvents(
          this.props.auth.user.id,
          this.props.auth.user.accessLevel
        )
          .then((response) => {
            if (response.statusCode === 200) {
              let body = JSON.parse(response.body);
              let events = [];
              for (let i = 0; i < body.length; i++)
                events.push({
                  label: body[i].eventdate,
                  value: body[i].eventdate,
                });
              this.setState({ eventList: events });
            } else console.log("An error has occurred, Please try again.");

            // populates the selected array with false values
            for (let i = 0; i < this.state.teamTable.length; i++)
              this.selected.push(false);
          })
          .catch(() => console.log("Something went wrong. Please try again"));
      })
      .catch(() => console.log("Something went wrong. Please try again"));
  };

  /*
   * Binds a registered team to a specific event date.
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
  async handleSaveChanges() {
    let eventTeams = [];
    const { dispatch } = this.props;

    for (let i = 0; i < this.selected.length; i++) {
      if (this.selected[i] === true) eventTeams.push(this.state.teamTable[i]);
    }

    // data checks
    if (this.eventDate === "")
      this.props.dispatchError("Event Date is required");

    if (eventTeams.length < 1) this.props.dispatchError("No Team is selected.");

    for (let i = 0; i < eventTeams.length; i++) {
      await participantService
        .addParticipant(
          eventTeams[i].teamname,
          eventTeams[i].schoolname,
          eventTeams[i].statecode,
          eventTeams[i].questionlevel,
          this.eventDate
        )
        .then((response) => {
          if (response.statusCode === 201)
            return this.props.dispatchSuccess(
              "Team successfully added to the event!"
            );
        })
        .catch(() => {
          this.props.dispatchError(
            "Something went wrong. Team selected may already be added"
          );
        });
    }
  }

  /*
   * Helper function handleAddTeamToEvent. Generates the data as a table.
   */
  generateTeamTable() {
    const teams = [];
    let count = 1;
    this.state.teamTable.forEach((team, index) => {
      if (this.advisoremail === undefined) {
        teams.push(
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{team.teamname}</td>
            <td>{team.schoolname}</td>
            <td>{team.addressline1}</td>
            <td>{team.State}</td>
            <td>{team.questionlevel}</td>
            <td>{team.firstname}</td> {/*This is the first name of an advisor*/}
            <td key={index}>
              <input
                type="checkbox"
                onClick={this.handleCheckboxClick}
                data-index={index}
              />
            </td>
          </tr>
        );
      } else if (team.advisoremail === this.advisoremail) {
        teams.push(
          <tr key={index}>
            <td>{count}</td>
            <td>{team.teamname}</td>
            <td>{team.schoolname}</td>
            <td>{team.schooladdress}</td>
            <td>{team.statecode}</td>
            <td>{team.questionlevel}</td>
            <td>{team.advisorname}</td>
            <td key={index}>
              <input
                type="checkbox"
                onClick={this.handleCheckboxClick}
                data-index={index}
              />
            </td>
          </tr>
        );
        count++;
      }
    });
    this.currentView = (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Team Name</th>
            <th>School</th>
            <th>Address</th>
            <th>State</th>
            <th>Level</th>
            <th>Advisor</th>
            <th>Add Team</th>
          </tr>
        </thead>
        <tbody>{teams}</tbody>
      </Table>
    );
    this.forceUpdate();
  }

  /*
   * Renders the component UI.
   */
  render() {
    return (
      <div>
        <h2>Add Teams</h2>
        <p>
          <b>Please fill out the information below.</b>
        </p>
        <div id="sub-nav">
          <p id="sub-nav-item">
            <b>Event Date</b>
          </p>
          <Select
            id="dropdown"
            styles={styles.selectStyles}
            placeholder="Select a Date"
            options={this.state.eventList}
            onChange={(e) => (this.eventdate = e.label)}
          />
        </div>
        {this.currentView}
        <div>
          <Button
            variant="primary"
            className="register-button"
            label="Save Changes"
            backgroundcolor={"#00a655"}
            labelcolor={"#ffffff"}
            onClick={() => this.handleSaveChanges()}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    errors: state.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchResetErrors: () => dispatch(clearErrors()),
		dispatchError: (message) =>
			dispatch(updateErrorMsg(message)),
		dispatchSuccess: (message) =>
			dispatch(updateSuccessMsg(message))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEventTeam);
