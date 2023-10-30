/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
// import { Table } from "react-bootstrap";
import StatusMessages from "../../_common/components/status-messages/status-messages.jsx";
import TeamService from "../../_common/services/team";
import EventService from "../../_common/services/event";
import UserService from "../../_common/services/user"; //added to get all the students on a team Natalie Laughlin
// import ReactTable from "react-table";
import DataTable from "react-data-table-component";
import Select from "react-select";
// import "react-table/react-table.css";
import { connect } from "react-redux";
// import "../../_common/assets/css/ReactTableCSS.css";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";

/*
 * @author: Daniel Bell
 * @Updated: Natalie Laughlin - view students on team and limate the advisors view
 */
class ViewTeams extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.advisor =
      this.props.advisor !== undefined ? this.props.advisor.email : undefined;
    this.state = {
      expanded: {},
      teamName: "",
      userTable: [],
      teamTable: [],
      eventList: [],
      columnsForAllTeams: this.getAllTeamColumns(),
      columnsForSpecficTeams: this.getSpecficTeamUsersColumns(),
    };
  }

  /*
   * Returns a list of all registered teams when the component is rendered.
   * If an advisor is logged in, the list of teams registered with that advisor is returned.
   */
  componentDidMount = () => {
    TeamService.getAllTeams()
      .then((response) => {
        var data = JSON.parse(response.body);
        console.log(response.data);
        if (response.ok && this.advisor === undefined) {
          this.setState({ teamTable: data });
        } else if (response.ok) {
          var registeredTeams = [];
          data.forEach((team, index) => {
            if (team.email === this.advisor) {
              registeredTeams.push({
                id: index,
                teamname: team.teamname,
                schoolname: team.schoolname,
                addressline1: team.addressline1,
                addressline2: team.addressline2,
                city: team.city,
                state: team.state,
                usdcode: team.usdcode,
                questionlevel: team.questionlevel,
                email: team.email,
              });
            }
          });
          this.setState({ teamTable: registeredTeams });
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));

    EventService.getAllEvents(
      this.props.auth.user.id,
      this.props.auth.user.accessLevel
    )
      .then((response) => {
        let body = response.body;
        console.log(response.data);
        let events = [];
        if (response.ok) {
          for (let i = 0; i < body.length; i++) {
            events.push({
              label: body[i].eventname,
              value: body[i].eventname,
            });
          }
        } else {
          console.log("An error occured, Please try again.");
        }
        this.setState({ eventList: events });
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
  };
  /*
   *Returns a list of all registered users when the component is rendered.  coppied from view users.jsx
   *  @author: Daniel Bell  Modified by Natalie Laughlin
   */
  seeusers(teamName) {
    UserService.getstudentsteam(teamName)
      .then((response) => {
        console.log(response.data);
        if (response.ok) {
          this.setState({ userTable: response.body });
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
    //document.getElementById("button").style.color="green";
    //button.
    //button.style.textAlign="right";
  }

  /*
   * Updates the list of teams based on selected event
   */
  UpdateTeams(nameofevent) {
    TeamService.getAllTeamsInCompName(nameofevent).then((response) => {
      let teams = [];
      if (response.body.length > 0) {
        let body = response.body;
        console.log(response.data);
        if (
          response.ok &&
          this.state.advisorEmail === undefined
        ) {
          for (let i = 0; i < body.length; i++) {
            teams.push({
              id: i,
              teamname: body[i].teamname,
              schoolname: body[i].schoolname,
              addressline1: body[i].addressline1,
              addressline2: body[i].addressline2,
              city: body[i].city,
              state: body[i].state,
              usdcode: body[i].usdcode,
              questionlevel: body[i].questionlevel,
              email: body[i].email,
            });
          }
        } else if (response.ok) {
          for (let i = 0; i < body.length; i++) {
            if (body[i].email === this.state.advisorEmail) {
              //was not accesting the right data fixed Natalie Laughlin
              teams.push({
                id: i,
                teamname: body[i].teamname,
                schoolname: body[i].schoolname,
                addressline1: body[i].addressline1,
                addressline2: body[i].addressline2,
                city: body[i].city,
                state: body[i].state,
                usdcode: body[i].usdcode,
                questionlevel: body[i].questionlevel,
                email: body[i].email,
              });
            }
          }
        } else {
          this.props.dispatchError(
            `There was an error filtering students by "${nameofevent}" event`
          );
        }
      }
      this.setState({ teamTable: teams });
    });
  }

  getAllTeamColumns() {
    return [
      {
        Header: "Team Name",
        selector: row => row.teamname,
      },
      {
        Header: "School Name",
        selector: row => row.schoolname,
      },
      {
        Header: "Address Line 1",
        selector: row => row.addressline1,
      },
      {
        Header: "Address Line 2",
        selector: row => row.addressline2,
      },
      {
        Header: "City",
        selector: row => row.city,
      },
      {
        Header: "State",
        selector: row => row.state,
      },
      {
        Header: "USD",
        selector: row => row.usdcode,
      },
      {
        Header: "Question Level",
        selector: row => row.questionlevel,
      },
      {
        Header: "Email",
        selector: row => row.email,
      },
    ];
  }
  getSpecficTeamUsersColumns() {
    return [
      {
        Header: "First Name",
        accessor: "first",
      },
      {
        Header: "Last Name",
        accessor: "lastname",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
    ];
  }

  handleRowExpanded(newExpanded, index, event) {
    this.setState({
      // we override newExpanded, keeping only current selected row expanded
      expanded: {
        [index[0]]: !this.state.expanded[index[0]],
      },
    });
  }
  /*
   * Renders the current view - the table with all the teams - and the status messages for successess/errors
   */
  render() {
    return (
      <div>
        <StatusMessages />
        <h2>Teams</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ marginRight: "10px", fontSize: "16px" }}>
            Select Event:
          </span>
          <div id="sub-nav" className="teamDropDown">
            <Select
              id="event-dropdown"
              placeholder="Select Event"
              options={this.state.eventList}
              onChange={(opt) => this.UpdateTeams(opt.label)}
            />
          </div>
        </div>
        
        <DataTable data={this.state.teamTable} columns={this.state.columns}/>
      
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewTeams);
