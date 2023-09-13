import React from "react";
import { Button } from "react-bootstrap";
import TeamList from "./teamList";
import TeamsNeedingAssignmentList from "./teamsNeedingAssignmentList";
import VolunteerList from "./volunteerList";
import "./modalStyleSheet.css";
import teamsNeedingAssignment from "./teamsNeedingAssignment";
import teamsNeedingAssignmentList from "./teamsNeedingAssignmentList";

// set differently depending on type prop of modal
let content;

/*
 *   @author: Trey Moddelmog
 */
export default class modal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialItems: [],
      items: [],
    };
  }

  /*
   *  when component mounts set the initial items and items arrays in the state
   */
  componentDidMount = () => {
    this.setState({
      initialItems: this.props.members,
      items: this.props.members,
    });
  };

  /*
   *  filter the the team items when input form is changed
   */
  filterListTeam = (event) => {
    let items = this.state.initialItems;
    items = items.filter((i) => {
      let teamName = i.teamname + " - " + i.schoolname + " ";
      return (
        teamName.toLowerCase().search(event.target.value.toLowerCase()) !== -1
      );
    });
    this.setState({ items: items });
  };

  /*
   *  filter the the volunteer items when input form is changed
   */
  filterListVolunteer = (event) => {
    let items = this.state.initialItems;
    items = items.filter((i) => {
      let name = i.firstname + " " + i.lastname + " ";
      return name.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
    });
    this.setState({ items: items });
  };

  /*
   *  prevent form input from submitting when enter is pressed
   */
  handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  /*
   *  @Karijanna Miller
   *  The search bar only appears for desktop views
   *  The search bar that appears for every different model only appears on desktop view
   */
  render() {
    let type = this.props.type;
    if (type === "team") {
      // content set for team
      content = (
        <div>
          <form class="visible-lg">
            <input
              className={"input"}
              type={"text"}
              placeholder={" Search team name..."}
              onChange={this.filterListTeam}
              onKeyDown={this.handleKeyDown}
            />
          </form>
          <h3>Teams</h3>
          <TeamList
            teams={this.state.items}
            handleTeam={this.props.handleTeam}
          />
        </div>
      );
    } else if (type === "teamsNeedingAssignmentList") {
      // content set for team
      content = (
        <div>
          <form class="visible-lg">
            <input
              className={"input"}
              type={"text"}
              placeholder={" Search team name..."}
              onChange={this.filterListTeam}
              onKeyDown={this.handleKeyDown}
            />
          </form>
          <h3>Teams</h3>
          <TeamsNeedingAssignmentList
            teams={this.state.items}
            onClick={this.props.handleEvent}
            label={"Add"}
            buttonStyle={"success"}
          />
        </div>
      );
    } else if (type === "showVolunteer") {
      // content set for team
      content = (
        <div>
          <form class="visible-lg">
            <input
              className={"input"}
              type={"text"}
              placeholder={" Search volunteer name..."}
              onChange={this.filterListVolunteer}
              onKeyDown={this.handleKeyDown}
            />
          </form>
          <h3>Volunteers</h3>
          <li>
            <VolunteerList
              volunteers={this.state.items}
              onClick={this.props.handleEvent}
              label={"Assign"}
              buttonStyle={"success"}
            />
          </li>
        </div>
      );
    } else if (type === "volunteer") {
      // content set for volunteer
      content = (
        <div>
          <form class="visible-lg">
            <input
              className={"input"}
              type={"text"}
              placeholder={" Search volunteer name..."}
              onChange={this.filterListVolunteer}
              onKeyDown={this.handleKeyDown}
            />
          </form>
          <h3>Volunteers</h3>
          <VolunteerList
            volunteers={this.state.items}
            onClick={this.props.handleEvent}
            label={"Remove"}
            buttonStyle={"danger"}
          />
        </div>
      );
    } else {
      // content set for user
      content = (
        <div>
          <form class="visible-lg">
            <input
              className={"input"}
              type={"text"}
              placeholder={" Search user name..."}
              onChange={this.filterListVolunteer}
              onKeyDown={this.handleKeyDown}
            />
          </form>
          <h3>Users</h3>
          <VolunteerList
            volunteers={this.state.items}
            onClick={this.props.handleEvent}
            label={"Check In"}
            buttonStyle={"success"}
          />
        </div>
      );
    }
    return (
      <div className={"modalBackground"}>
        <div className={"modalContent"}>
          <span className={"pull-right"}>
            <Button className={"closeButton"} onClick={this.props.handleClose}>
              x
            </Button>
          </span>
          {content}
        </div>
      </div>
    );
  }
}
