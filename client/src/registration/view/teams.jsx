/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import { Table } from "react-bootstrap";
import StatusMessages from "../../_common/components/status-messages/status-messages.jsx";
import TeamService from "../../_common/services/team";
import EventService from "../../_common/services/event";
import UserService from "../../_common/services/user"; //added to get all the students on a team Natalie Laughlin
import ReactTable from "react-table";
import Select from "react-select";
import "react-table/react-table.css";
import {
  UPDATE_SUCCESS_MSG,
  UPDATE_ERROR_MSG,
  CLEAR_ERRORS,
} from "../../_store/actions/types";
import { connect } from "react-redux";
import "../../_common/assets/css/ReactTableCSS.css";

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
        if (response.statusCode === 200 && this.advisor === undefined) {
          this.setState({ teamTable: data });
        } else if (response.statusCode === 200) {
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
        let events = [];
        if (response.statusCode === 200) {
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
        if (response.statusCode === 200) {
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
        if (
          response.statusCode === 200 &&
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
        } else if (response.statusCode === 200) {
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
        accessor: "teamname",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "School Name",
        accessor: "schoolname",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "Address Line 1",
        accessor: "addressline1",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "Address Line 2",
        accessor: "addressline2",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "City",
        accessor: "city",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "State",
        accessor: "state",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "USD",
        accessor: "usdcode",
        Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
      },
      {
        Header: "Question Level",
        accessor: "questionlevel",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
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
        <ReactTable
          filterable
          className="-striped -highlight"
          data={this.state.teamTable}
          columns={this.state.columnsForAllTeams}
          minRows={10}
          style={{ margin: "20px 60px" }}
          expanded={this.state.expanded}
          onExpandedChange={(newExpanded, index, event, row) => {
            this.seeusers(row.original.teamname);
            this.handleRowExpanded(newExpanded, index, event);
          }}
          SubComponent={({ row, nestingPath }) => {
            return (
              <div
                style={{
                  padding: "5px 40px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  borderTop: "1px solid lightgray",
                  borderBottom: "1px solid lightgray",
                }}
              >
                <h5>Team Members:</h5>
                {this.state.userTable.length === 0 ? (
                  <p style={{ fontSize: "14px" }}>
                    There is no one assigned to this team.
                  </p>
                ) : (
                  <ul>
                    {this.state.userTable.map((user) => (
                      <li key={user.email}>
                        <h4 style={{ fontSize: "12px" }}>
                          {user.firstname} {user.lastname}
                        </h4>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          }}
          expandedRows
        />
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
    dispatchResetErrors: () => dispatch({ type: CLEAR_ERRORS }),
    dispatchError: (message) =>
      dispatch({ type: UPDATE_ERROR_MSG, payload: message }),
    dispatchSuccess: (message) =>
      dispatch({ type: UPDATE_SUCCESS_MSG, payload: message }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewTeams);
