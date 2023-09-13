/*
    Needs to be finished:
        Teams needing volunteers list.
            Send a request to the volunteer being assigned
            and if volunteer doesn't respond to request within a certain time
            put team in list or assign next available judge.
        Make screen resize nicely.
*/

import React from "react";
import { Button } from "react-bootstrap";
import VolunteerList from "./volunteerList";
import ActiveVolunteerList from "./activeVolunteerList";
import TeamsNeedingAssignmentList from "./teamsNeedingAssignmentList";
import TeamList from "./teamList";
import Modal from "./modal";
import StatusMessages from "../_common/components/status-messages/status-messages.jsx";
import UserService from "../_common/services/user";
import TeamService from "../_common/services/team";
import "./stylesheet.css";
import ActiveTeamsNeedingAssignmentList from "./activeTeamsNeedingAssignmentList";
import teamsNeedingAssignment from "./teamsNeedingAssignment";

/*
 *   @author: Trey Moddelmog
 */
export default class VolunteersBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Users: [],
      Volunteers: [],
      ActiveVolunteers: [],
      Teams: [],
      ActiveTeamsNeedingAssignment: [],
      TeamsNeedingAssingment: [],
      showTeamModal: false,
      showRemoveModal: false,
      showCheckInModal: false,
      showTeamNeedingAssignmentModal: false,
      currentTeamID: null,
      currentVolunteerID: null,
      currentTeamID: null,
    };
  }

  /*
   *  open or close team modal
   */
  toggleTeamModal = () => {
    this.setState((prevState) => ({ showTeamModal: !prevState.showTeamModal }));
  };

  /*
   *  open or close remove modal
   */
  toggleRemoveModal = () => {
    this.setState((prevState) => ({
      showRemoveModal: !prevState.showRemoveModal,
    }));
  };

  /*
   *  open or close volunteer modal
   */
  toggleVolunteerModal = () => {
    this.setState((prevState) => ({ showVolunteer: !prevState.showVolunteer }));
  };

  /*
   *  open or close check in modal
   */
  toggleCheckInModal = () => {
    this.setState((prevState) => ({
      showCheckInModal: !prevState.showCheckInModal,
    }));
  };

  /*
   *  remove volunteer from volunteers
   */
  removeVolunteer = (vID) => {
    // get the volunteer to remove from volunteers in state
    let user = this.state.Volunteers.find((v) => v.userid === vID);

    // get the new list of volunteers by removing the volunteer that is getting removed
    let newVolsList = this.state.Volunteers.filter((v) => v.userid !== vID);

    this.setState({
      Users: [...this.state.Users, user],
      Volunteers: newVolsList,
    });

    // close volunteer modal that is opened by button click
    this.toggleRemoveModal();
  };

  /*
   *  @May Phyo
   * open or close list of team in teams needing assingment modal
   */
  toggleTeamsNeedingAssignmentModal = () => {
    this.setState((prevState) => ({
      showTeamNeedingAssignmentModal: !prevState.showTeamNeedingAssignmentModal,
    }));
  };

  /* @Karijanna Miller
        Handle volunteer for desktop view
     *  set the current volunteer ID in the state and open the team modal
     */
  handleVolunteer = (vID) => {
    console.log(this.state.currentVolunteerID);
    this.setState({ currentVolunteerID: vID });
    this.toggleTeamModal();
  };

  /* @Karijanna Miller
       Handle volunteer for mobile view
    */
  handleVolunteerMobile = (vID) => {
    console.log(this.state.currentVolunteerID);
    this.setState({ currentVolunteerID: vID });
    this.toggleTeamModal();
  };

  /*
   *  set the current team ID in the state, then close the team modal and call assignVolunteer()
   */
  handleTeam = (tID) => {
    this.setState({ currentTeamID: tID }, () => {
      this.toggleTeamModal();
      this.assignVolunteertoTeam();
    });
  };

  openTeamNeedingAssignmentModal = (tID) => {
    this.setState({ currentTeamID: tID });

    this.toggleVolunteerModal();
  };

  handleAssignment = (vID) => {
    this.setState({ currentVolunteerID: vID });

    this.assignTeamtoVolunteer(vID);
  };

  /*
   *@ May Phyo
   * Adds assignment to volunteer based on team
   */
  assignTeamtoVolunteer = (vID) => {
    //let vID= this.state.currentVolunteerID;
    // get the team from teams in state
    //let team = this.state.TeamsNeedingAssingment.find(t => t.teamid !== this.state.currentTeamID);
    //let tID = team.teamid;
    let tID = this.state.currentTeamID;

    // get the volunteer from volunteers in state
    let vol = this.state.Volunteers.find((v) => v.userid === vID);

    // get the new list of volunteers by removing the volunteer that is getting assigned
    let newVolsList = this.state.Volunteers.filter((v) => v.userid !== vID);
    // get the team from team
    let team = this.state.TeamsNeedingAssingment.find((t) => t.teamid === tID);

    let newTeamNeedingAssignmentList = this.state.TeamsNeedingAssingment.filter(
      (t) => t.teamid !== tID
    );

    let newTeamList = this.state.Teams.filter((t) => t.teamid !== tID);

    this.setState({
      //Remove that volunteer from current volunteer list
      Volunteers: newVolsList,
      //Add that volunteer to Active Volunter List
      ActiveVolunteers: [...this.state.ActiveVolunteers, vol],
      // Remove that Team from Teams that Need Assignment
      TeamsNeedingAssingment: newTeamNeedingAssignmentList,
      //Add that team to ActiveTeamsNeedingAssignment
      ActiveTeamsNeedingAssignment: [
        ...this.state.ActiveTeamsNeedingAssignment,
        team,
      ],
      Teams: newTeamList,
    });
    this.toggleVolunteerModal();
    this.toggleTeamsNeedingAssignmentModal();
    console.log(
      vol.firstname +
        " " +
        vol.lastname +
        " has been assigned to " +
        team.teamname +
        " - " +
        team.schoolname
    );
    // update the database with new assignment
    UserService.logVolunteerAssignment("1", vID, tID);
  };

  /*
   *  @ May Phyo
   * assign volunteer to team and move to ActiveVolunteers in state
   */
  assignVolunteertoTeam = () => {
    // get the team from teams in state
    let team = this.state.Teams.find(
      (t) => t.teamid === this.state.currentTeamID
    );
    let tID = team.teamid;

    let vID = this.state.currentVolunteerID;

    // get the volunteer from volunteers in state
    let vol = this.state.Volunteers.find((v) => v.userid === vID);

    // get the new list of volunteers by removing the volunteer that is getting assigned
    let newVolsList = this.state.Volunteers.filter((v) => v.userid !== vID);

    let newTeamNeedingAssignmentList = this.state.TeamsNeedingAssingment.filter(
      (t) => t.teamid !== tID
    );

    let newTeamList = this.state.Teams.filter((t) => t.teamid !== tID);

    this.setState({
      //Remove that volunteer from current volunteer list
      Volunteers: newVolsList,
      //Add that volunteer to Active Volunter List
      ActiveVolunteers: [...this.state.ActiveVolunteers, vol],
      // Remove that Team from Teams that Need Assignment
      TeamsNeedingAssingment: newTeamNeedingAssignmentList,
      //Add that team to ActiveTeamsNeedingAssignment
      ActiveTeamsNeedingAssignment: [
        ...this.state.ActiveTeamsNeedingAssignment,
        team,
      ],
      Teams: newTeamList,
    });

    console.log(
      vol.firstname +
        " " +
        vol.lastname +
        " has been assigned to " +
        team.teamname +
        " - " +
        team.schoolname
    );
    // update the database with new assignment
    UserService.logVolunteerAssignment("1", vID, tID);
  };

  /*
   *  check in a volunteer by moving them from users list to volunteers list in state
   */
  checkInVolunteer = (uID) => {
    // get the user to add to volunteers from users in state
    let vol = this.state.Users.find((u) => u.userid === uID);

    // get the new list of users by removing the user that is getting moved to volunteers
    let newUsersList = this.state.Users.filter((u) => u.userid !== uID);

    this.setState({
      Users: newUsersList,
      Volunteers: [...this.state.Volunteers, vol],
    });

    // close check in modal that is opened by button click
    this.toggleCheckInModal();

    console.log("selecting volunteer");
  };

  /*
   *  @ May Phyo
   * Handles the return button under Active Volunteer list
   */
  handleActiveVolunterRemoval = (vID) => {
    this.setState({ currentVolunteerID: vID });
    this.getTeam(vID);
  };
  getTeam = (vID) => {
    UserService.getVolunteerAssignment(vID)
      .then((response) => {
        if (response.statusCode === 200) {
          let body = response.body;
          this.setState({ currentTeamID: body[body.length - 1].teamid });
          console.log("TeamID", this.state.currentTeamID);

          this.removeActiveVolunteer(this.state.currentTeamID);
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

  /*
    * @ May Phyo
    Removes volunteer and team from active when return button pressed under Active Volunteer list
    */
  removeActiveVolunteer = (tID) => {
    let vID = this.state.currentVolunteerID;
    console.log(this.state.currentVolunteerID);

    // get the volunteer to remove from active volunteers in state
    let vol = this.state.ActiveVolunteers.find((v) => v.userid === vID);
    // console.log(vol)
    // get the new list of active volunteers by removing the volunteer that is getting removed
    let newActVolsList = this.state.ActiveVolunteers.filter(
      (v) => v.userid !== vID
    );

    let newActiveTeamList = this.state.ActiveTeamsNeedingAssignment.filter(
      (t) => t.teamid !== tID
    );
    console.log(newActiveTeamList);

    let team = this.state.ActiveTeamsNeedingAssignment.find(
      (t) => t.teamid === tID
    );

    this.setState({
      //Add volunteer back to volunteer list
      Volunteers: [...this.state.Volunteers, vol],
      //Remove the volunteer from Active volunter list

      ActiveVolunteers: newActVolsList,
      // Add that Team to Teams Needing Assignment
      TeamsNeedingAssingment: [...this.state.TeamsNeedingAssingment, team],
      //Remove that team to ActiveTeamsNeedingAssignment
      ActiveTeamsNeedingAssignment: newActiveTeamList,
      //Add that Team to Teams llist
      Teams: [...this.state.Teams, team],
    });
    //Removes the assignment from the database
    UserService.removeAssignment(vID);
  };

  /*
    /* @ May Phyo
     *  handles the remove button under Active Team
     */
  handleActiveTeamRemoval = (tID) => {
    this.setState({ currentTeamID: tID });
    this.getVolunteer(tID);
  };

  /*
   * @May PHyo
   * Retrieves the volunteer based on teamID
   */

  getVolunteer = (tID) => {
    UserService.getTeamAssignment(tID)
      .then((response) => {
        if (response.statusCode === 200) {
          let body = response.body;
          console.log(body);
          this.setState({
            currentVolunteerID: body[body.length - 1].volunteerid,
          });
          //  console.log('VolunteerID',this.state.currentVolunteerID)

          this.removeActiveTeam(this.state.currentVolunteerID);
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

  /*
    /*
     *  @May Phyo
    * Removes volunteers and teams from being active when pressing "return" under Active Team list
     */
  removeActiveTeam = (vID) => {
    let tID = this.state.currentTeamID;

    // get the volunteer to remove from active volunteers in state
    let vol = this.state.ActiveVolunteers.find((v) => v.userid === vID);
    // console.log(vol)
    // get the new list of active volunteers by removing the volunteer that is getting removed
    let newActVolsList = this.state.ActiveVolunteers.filter(
      (v) => v.userid !== vID
    );

    let newActiveTeamList = this.state.ActiveTeamsNeedingAssignment.filter(
      (t) => t.teamid !== tID
    );
    console.log(newActiveTeamList);

    let team = this.state.ActiveTeamsNeedingAssignment.find(
      (t) => t.teamid === tID
    );

    this.setState({
      //Add volunteer back to volunteer list
      Volunteers: [...this.state.Volunteers, vol],
      //Remove the volunteer from Active volunter list

      ActiveVolunteers: newActVolsList,
      // Add that Team to Teams Needing Assignment
      TeamsNeedingAssingment: [...this.state.TeamsNeedingAssingment, team],
      //Remove that team to ActiveTeamsNeedingAssignment
      ActiveTeamsNeedingAssignment: newActiveTeamList,
      //Add that Team to Teams llist
      Teams: [...this.state.Teams, team],
    });
    UserService.removeAssignment(vID);
  };

  /*
   *  when component mounts populate users in the state from volunteers in the database
   *  and populate teams in state with teams from database
   */
  componentDidMount = () => {
    UserService.getAllVolunteers()
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ Users: JSON.parse(response.body) });
        } else {
          console.log(
            "An error has occurred while getting users, Please try again."
          );
        }
      })
      .catch((resErr) => {
        console.log(resErr);
      });

    TeamService.getAllTeams()
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ Teams: JSON.parse(response.body) });
        } else {
          console.log(
            "An error has occurred while getting teams, Please try again."
          );
        }
      })
      .catch((resErr) => {
        console.log(resErr);
      });

    TeamService.getAllTeams()
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ TeamsNeedingAssingment: JSON.parse(response.body) });
        } else {
          console.log(
            "An error has occurred while getting teams, Please try again."
          );
        }
      })
      .catch((resErr) => {
        console.log(resErr);
      });
  };

  /*
     *  @Karijanna Miller
     *  Added mobile only view buttons (visible-xs) 
     *  and desktop only view buttons (visible-lg)
     * <li class="visible-xs">
                        <Button
                            className={'button'}
                            onClick={this.handleActiveTeamRemoval}
                            bsStyle="danger">
                            Return
                            <TeamsNeedingAssignmentList
                             teams={this.state.ActiveTeamsNeedingAssignment}                     
                        /> 
                        </Button>
                        </li>
     */

  render() {
    return (
      <React.Fragment>
        <StatusMessages />
        <div>
          {/* @Karijanna Miller volunteers list */}
          <div className={"middle"}>
            <h3>Volunteers</h3>
            <li class="visible-lg">
              <VolunteerList
                volunteers={this.state.Volunteers}
                onClick={this.handleVolunteer}
                label={"Assign"}
                buttonStyle={"success"}
              />
            </li>
            <div class="d-flex flex-wrap">
              <li class="visible-xs">
                <Button onClick={this.toggleCheckInModal} bsStyle="success">
                  Check In
                  <VolunteerList
                    volunteers={this.state.Volunteers}
                    label={"Assign"}
                    bsStyle="success"
                    onClick={this.handleVolunteerMobile}
                  />
                </Button>
              </li>
            </div>
            {/* @Karijanna Miller volunteers list */}
            <li class="visible-lg">
              <Button
                className={"button"}
                bsStyle="success"
                onClick={this.toggleCheckInModal}
              >
                Check In
              </Button>
            </li>
            <Button
              className={"button"}
              bsStyle="danger"
              onClick={this.toggleRemoveModal}
            >
              Remove
            </Button>

            {/* @Karijanna Miller teams needing volunteer list */}
            <h3> Active Teams</h3>
            <li class="visible-lg">
              <TeamsNeedingAssignmentList
                teams={this.state.ActiveTeamsNeedingAssignment}
                onClick={this.handleActiveTeamRemoval}
                label={"Return"}
                buttonStyle={"danger"}
              />
            </li>
            <Button
              className={"button"}
              bsStyle="success"
              onClick={this.toggleTeamsNeedingAssignmentModal}
            >
              Add Team Needing Assignment
            </Button>
          </div>
          {/* active volunteers list */}
          <div className={"right"}>
            <h3>Active Volunteers</h3>
            <ActiveVolunteerList
              volunteers={this.state.ActiveVolunteers}
              onClick={this.handleActiveVolunterRemoval}
            />
            <h3>Finished Teams</h3>
          </div>

          {/* team modal. only shown when showTeamModal in state is true */}
          {this.state.showTeamModal ? (
            <Modal
              type={"team"}
              members={this.state.Teams}
              handleClose={this.toggleTeamModal}
              handleTeam={this.handleTeam}
            />
          ) : null}

          {/* @May Phyo showTeamAssignment modal. only shown when showTeamModal in state is true */}
          {this.state.showTeamNeedingAssignmentModal ? (
            <Modal
              type={"teamsNeedingAssignmentList"}
              members={this.state.TeamsNeedingAssingment}
              handleClose={this.toggleTeamsNeedingAssignmentModal}
              handleEvent={this.openTeamNeedingAssignmentModal}
            />
          ) : null}

          {/* volunteer modal. only shown when showRemoveModal in state is true */}
          {this.state.showRemoveModal ? (
            <Modal
              type={"volunteer"}
              members={this.state.Volunteers}
              handleClose={this.toggleRemoveModal}
              handleEvent={this.removeVolunteer}
            />
          ) : null}

          {/* volunteer modal. only shown when showRemoveModal in state is true */}

          {/* user modal. only shown when showCheckInModal in state is true */}
          {this.state.showCheckInModal ? (
            <Modal
              type={"user"}
              members={this.state.Users}
              handleClose={this.toggleCheckInModal}
              handleEvent={this.checkInVolunteer}
            />
          ) : null}

          {this.state.showVolunteer ? (
            <Modal
              type={"showVolunteer"}
              members={this.state.Volunteers}
              handleEvent={this.handleAssignment}
              handleClose={this.toggleVolunteerModal}
            />
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}
