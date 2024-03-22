/*
 * @author: May Phyo
 * This screen will lists the questions to be judged by each round the competition is in.
 *
 */
import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import UserService from "../_common/services/user";

import TeamService from "../_common/services/team";
// import Questions from "./volunteerAssignmentQuestion";

import "./stylesheet.css";
import "../_common/assets/css/dashboard-home.css";

export default class StartJudging extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: this.props.currentUser,
      // currentTeam: this.props.currentTeam,
      currentTeamID: 0,
      currentTeamName: "",
      // currentTeam: [],
      show: false,
    };
  }

  /*
   * Finds the team assigned to the volunteer and display it
   */
  componentDidMount = () => {
    UserService.getVolunteerAssignment(this.state.userId)
      .then((response) => {
        if (response.statusCode === 200) {
          let body = response.body;
          this.setState({ currentTeamID: body[body.length - 1].teamid });
          this.setState({
            show: body[body.length - 1].teamid === null ? false : true,
          });

          /*Gets the team information from the volunteer assignment.*/
          TeamService.getVolunteerTeam(body[body.length - 1].teamid)
            .then((response) => {
              console.log(response);
              if (response.statusCode === 200) {
                this.setState({ currentTeam: response.body });
                console.log("Team", this.state.currentTeam[0].teamname);
              } else {
                console.log(
                  "An error has occurred while getting teams, Please try again."
                );
              }
            })
            .catch((resErr) => {
              console.log(resErr);
            });
        } else {
          console.log(
            "An error has occurred while getting assignment, Please try again."
          );
        }
      })
      .catch((resErr) => {
        console.log("resErr:", resErr);
      });
  };

  renderTeamLevel() {
    if (this.state.currentTeam[0].questionlevelid === 1)
      return <h2>Beginner </h2>;
    return <h2>Advance </h2>;
  }

  renderNoAssignmentMessage() {
    if (this.state.show === false)
      return (
        <h2>You are not assigned to a team, please ask to be assigned.</h2>
      );
  }
  /*
   * Shows the team ID number and the Team name, along with a link to re-direct them to the list of problems
   */

  render() {
    return (
      <div className="startJudging">
        <div style={{ display: this.state.show ? "block" : "none" }}>
          {this.state.currentTeam.map((team) => (
            <div key="{team}">
              <h1>
                {" "}
                Team #{team.teamid} - {team.teamname}
              </h1>
            </div>
          ))}
          {this.state.currentTeam.map((team) => (
            <div key="{team}"> {this.renderTeamLevel()}</div>
          ))}

          <Button bsStyle="info">
            <Link
              to={{
                pathname: "/volunteer/startjudging",
                state: { team: this.state.currentTeam },
              }}
            >
              {" "}
              Start Judging{" "}
            </Link>
          </Button>
        </div>

        {this.renderNoAssignmentMessage()}
      </div>
    );
  }
}
