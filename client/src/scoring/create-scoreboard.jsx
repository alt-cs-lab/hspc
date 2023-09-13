import React, { Component } from "react";
import StatusMessages from "../_common/components/status-messages/status-messages";

import "../_common/assets/css/create-scoreboard.css";
import UserService from "../_common/services/scorecard.js";
import { Table } from "react-bootstrap";

const columns = [
  { dataField: "index", text: "ID" },
  { dataField: "team", text: "Team" },
  { dataField: "school", text: "School" },
  { dataField: "state", text: "State" },
  { dataField: "level", text: "Level" },
];
var currentView = null;

var currentView = null;

/*
 * @author: Daniel Bell
 * @Updated: Natalie Laughlin
 */
export default class BoardSetup extends Component {
  constructor(props) {
    super(props);
    this.currentView = null;
    this.state = {
      scoreTable: [],
    };
  }
  /* Gets the score baced on the date the user has selceted
   *
   */
  componentDidMount = () => {
    UserService.getAllScores()
      .then((response) => {
        var data = JSON.parse(response.body);
        if (response.statusCode === 200) {
          this.setState({ scoreTable: data }, () => {
            this.generateScoreboardTable(); // helper function
          });
        } else if (response.statusCode === 200) {
          var registeredTeamsScores = [];
          data.forEach((team, index) => {
            if (team.AdvisorEmail === this.advisor) {
              registeredTeamsScores.push({
                ID: index,
                TeamName: team.TeamName,
                SchoolName: team.SchoolName,
                Score: team.score,
              });
            }
          });
          this.setState({ scoreTable: registeredTeamsScores }, () => {
            this.generateScoreTable(); // helper function
          });
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
  };

  /*
   * Helper function for handleShowTeams. Generates the data as a table.
   */
  generateScoreTable() {
    const scores = [];
    this.state.teamTable.forEach((team, index) => {
      scores.push(
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{team.teamname}</td>
          <td>{team.schoolname}</td>
          <td>{team.score}</td>
        </tr>
      );
    });
    currentView = (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Team Name</th>
            <th>School</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>{scores}</tbody>
      </Table>
    );
    this.forceUpdate();
  }

  /*
   * Renders the component UI
   */
  render() {
    return (
      <div>
        <StatusMessages />
        {currentView}
      </div>
    );
  }
}
