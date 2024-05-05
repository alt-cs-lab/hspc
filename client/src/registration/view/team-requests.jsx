/**
 * View team requests page
 * Author:
 * Modified: 5/1/2024
 */
import React, { Component, useState, useEffect } from "react";
import TeamService from "../../_common/services/team";
import EventService from "../../_common/services/event";
import RequestService from "../../_common/services/request";
import StudentService from "../../_common/services/high-school-student";
import { connect } from "react-redux";
import DataTable from "react-data-table-component";
import {
  clearErrors,
  updateErrorMsg,
  updateSuccessMsg,
} from "../../_store/slices/errorSlice.js";
import { Button } from "react-bootstrap";
import Select from "react-select";

const constants = require("../../_utilities/constants");

class SchoolRequests extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.state = {
      requestTable: [],
      columns: this.getColumns(),
      eventList: [],
      eventid: null,
      schoolTeamCountList: [],
      totalTeamCount: -1,
      totalBeginnerCount: -1,
      totalAdvancedCount: -1,
      teamCapacity: -1,
      beginnerCapacity: -1,
      advancedCapacity: -1,
      schoolCapacity: -1,
      beginnerSchoolCapacity: -1,
      advancedSchoolCapacity: -1,
    };
  }

  /*
   * Returns a list of all upgrade requests when the component is rendered.
   */
  componentDidMount = () => {
    // TWP TODO: Change to getRegisterableEvents
    EventService.getPublishedEvents(
      this.props.auth.user.id,
      this.props.auth.user.accessLevel
    )
      .then((response) => {
        if (response.ok) {
          let eventsbody = response.data;
          let events = [];
          for (let i = 0; i < eventsbody.length; i++) {
            if (eventsbody[i].status === "Registerable") {
              events.push({
                label: eventsbody[i].name,
                value: eventsbody[i].id,
                teamsPerEvent: eventsbody[i].teamsPerEvent,
                beginnerTeamsPerEvent: eventsbody[i].beginnerTeamsPerEvent,
                advancedTeamsPerEvent: eventsbody[i].advancedTeamsPerEvent,
                teamsPerSchool: eventsbody[i].teamsPerSchool,
                beginnerTeamsPerSchool: eventsbody[i].beginnerTeamsPerSchool,
                advancedTeamsPerSchool: eventsbody[i].advancedTeamsPerSchool,
              });
            }
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
   * Helper function for when a request is approved or denied.
   */
  handleCompleteRequest(approved, teamid) {
    RequestService.completeWaitlistedTeamRequest(approved, teamid)
      .then((response) => {
        if (response.status === 200) {
          if (approved) {
            this.props.dispatchSuccess("Team Registered Successfully.");
          } else {
            this.props.dispatchSuccess("Team Denied Successfully.");
          }

          /*
           * Update data, by recalling update competition
           */
          this.UpdateCompetition(
            this.state.eventid,
            this.state.teamCapacity,
            this.state.beginnerCapacity,
            this.state.advancedCapacity,
            this.state.schoolCapacity,
            this.state.beginnerSchoolCapacity,
            this.state.advancedSchoolCapacity
          );
        }
      })
      .catch((error) => {
        this.props.dispatchError(
          "There was an error completing the request. Please Try Again Later!"
        );
      });
  }

  /*
   *  Maps the database to the correct columns
   */
  getColumns() {
    return [
      {
        name: "Team Name",
        selector: (row) => row.teamname,
        sortable: true,
      },
      {
        name: "School Name",
        selector: (row) => row.schoolname,
        sortable: true,
      },
      {
        name: "Skill Level",
        selector: (row) => row.skilllevel,
        sortable: true,
      },
      {
        name: "School's Registered Teams",
        cell: (row) => {
          let teamcaps = this.getSchoolTeamCapacities(row.schoolid);
          return (
            <div>
              Beginner: {teamcaps.beginnerteamcount}/
              {this.state.beginnerSchoolCapacity} Advanced:{" "}
              {teamcaps.advancedteamcount}/{this.state.advancedSchoolCapacity}{" "}
              Total: {teamcaps.totalteamcount}/{this.state.schoolCapacity}
            </div>
          );
        },
      },
      {
        name: "Time Created",
        selector: (row) => row.timecreated,
        sortable: true,
      },
      {
        name: "Register",
        cell: (row) => {
          return (
            <Button
              onClick={() => {
                this.handleCompleteRequest(true, row.teamid);
              }}
            >
              Register
            </Button>
          );
        },
        button: true,
      },
      {
        name: "Deny",
        cell: (row) => {
          return (
            <Button
              variant="secondary"
              onClick={() => this.handleCompleteRequest(false, row.teamid)}
            >
              Deny
            </Button>
          );
        },
        button: true,
      },
    ];
  }

  getSchoolTeamCapacities(schoolid) {
    if (
      Object.keys(this.state.schoolTeamCountList).length > 0 &&
      this.state.schoolTeamCountList[schoolid] !== null
    )
      return this.state.schoolTeamCountList[schoolid];
    else
      return {
        beginnerteamcount: 0,
        advancedteamcount: 0,
        totalteamcount: 0,
      };
  }

  /*
   * Update Competition information and fill table with waitlisted teams.
   */
  UpdateCompetition = (
    eventid,
    teamsPerEvent,
    beginnerTeamsPerEvent,
    advancedTeamsPerEvent,
    teamsPerSchool,
    beginnerTeamsPerSchool,
    advancedTeamsPerSchool
  ) => {
    var requestTable = [];
    var schoolCapacities = {};
    var totalTeamCount = -1;
    var totalBeginnerCount = -1;
    var totalAdvancedCount = -1;

    TeamService.getTeamsInCompetition(eventid)
      .then((response) => {
        console.log(response);
        if (response.ok) {
          if (parseInt(response.data.teamcount) === 0) {
            totalTeamCount = 0;
            totalBeginnerCount = 0;
            totalAdvancedCount = 0;
          } else {
            totalTeamCount = parseInt(response.data.teamcount);
            totalBeginnerCount = parseInt(response.data.beginnerteamcount);
            totalAdvancedCount = parseInt(response.data.advancedteamcount);
          }
        } else
          console.log(
            "An error has occurred retrieving team competition capacities, Please try again."
          );

        TeamService.getTeamsInCompetitionForAllSchools(eventid)
          .then((response) => {
            if (response.ok) {
              let schoolData = response.data;
              for (let i = 0; i < schoolData.length; i++) {
                schoolCapacities[schoolData[i].schoolid] = {
                  schoolname: schoolData[i].schoolname,
                  beginnerteamcount: parseInt(schoolData[i].beginnerteamcount),
                  advancedteamcount: parseInt(schoolData[i].advancedteamcount),
                  totalteamcount: parseInt(schoolData[i].teamcount),
                };
              }
            } else
              console.log(
                "An error has occurred retrieving team school capacities, Please try again."
              );

            RequestService.getWaitlistedTeamsForEvent(eventid)
              .then((response) => {
                if (response.ok) {
                  requestTable = response.data;
                } else
                  console.log(
                    "An error has occurred retrieving waitlisted teams, Please try again."
                  );

                this.setState({
                  eventid: eventid,
                  teamCapacity: teamsPerEvent,
                  beginnerCapacity: beginnerTeamsPerEvent,
                  advancedCapacity: advancedTeamsPerEvent,
                  schoolCapacity: teamsPerSchool,
                  beginnerSchoolCapacity: beginnerTeamsPerSchool,
                  advancedSchoolCapacity: advancedTeamsPerSchool,
                  requestTable: requestTable,
                  schoolTeamCountList: schoolCapacities,
                  totalTeamCount: totalTeamCount,
                  totalBeginnerCount: totalBeginnerCount,
                  totalAdvancedCount: totalAdvancedCount,
                });
              })
              .catch((resErr) =>
                console.log(
                  "Something went wrong connecting to the server. Please try again"
                )
              );
          })
          .catch((resErr) =>
            console.log(
              "Something went wrong connecting to the server. Please try again"
            )
          );
      })
      .catch((resErr) =>
        console.log(
          "Something went wrong connecting to the server. Please try again"
        )
      );
  };

  /*
   * Renders the component UI
   */
  render() {
    return (
      <div>
        <h3>Select Event:</h3>
        <div class="add-margin">
          <Select
            id="event-dropdown"
            placeholder="Select Event"
            options={this.state.eventList}
            onChange={(target) =>
              this.UpdateCompetition(
                target.value,
                target.teamsPerEvent,
                target.beginnerTeamsPerEvent,
                target.advancedTeamsPerEvent,
                target.teamsPerSchool,
                target.beginnerTeamsPerSchool,
                target.advancedTeamsPerSchool
              )
            }
          />
        </div>
        <br />
        {this.state.eventid !== null ? (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <div className="mb-3" style={{ margin: "4px" }}>
                <h5>Total Event Capacity</h5>
                <h6>
                  {this.state.totalTeamCount}/{this.state.teamCapacity}
                </h6>
              </div>
              <hr width="1" size="100" />
              <div className="mb-3" style={{ margin: "4px" }}>
                <h5>Beginner Event Capacity</h5>
                <h6>
                  {this.state.totalBeginnerCount}/{this.state.beginnerCapacity}
                </h6>
              </div>
              <hr width="1" size="100" />
              <div className="mb-3" style={{ margin: "4px" }}>
                <h5>Advanced Event Capacity</h5>
                <h6>
                  {this.state.totalAdvancedCount}/{this.state.advancedCapacity}
                </h6>
              </div>
            </div>
            <div id="student-data-table">
              <h2>Waitlisted Team Requests</h2>
              <DataTable
                data={this.state.requestTable}
                columns={this.state.columns}
                pagination
                paginationPerPage={20}
                paginationRowsPerPageOptions={[20, 30, 40, 50]}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
              />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

// Method that returns a specific team.
const ExpandedComponent = ({ data }) => {
  const [teamUsersTable, setTeamUsersTable] = useState([]);
  const [error, setError] = useState(null);
  const [advisorName, setAdvisorName] = useState(null);
  const [advisorEmail, setAdvisorEmail] = useState(null);
  const [advisorPhone, setAdvisorPhone] = useState(null);

  useEffect(() => {
    StudentService.getStudentsInTeam(data.teamid)
      .then((response) => {
        if (response.ok) {
          setTeamUsersTable(response.data);
        } else {
          console.error("Error fetching team users: Response not OK");
          setError("Error fetching team user data.");
        }
      })
      .catch((error) => {
        console.error("Error in ExpandedComponent", error);
        setError("An unexpected error occurred.");
      });

    TeamService.getTeamDetails(data.teamid)
      .then((response) => {
        if (response.ok) {
          console.log(response.data);
          setAdvisorName(
            response.data.advisorfirstname + " " + response.data.advisorlastname
          );
          setAdvisorEmail(response.data.advisoremail);
          setAdvisorPhone(response.data.advisorphone);
        } else {
          console.error("Error fetching team data: Response not OK");
          setError("Error fetching team user data.");
        }
      })
      .catch((error) => {
        console.error("Error in ExpandedComponent", error);
        setError("An unexpected error occurred.");
      });
  }, [data.teamid]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <br />
      <div id="student-data-table">
        <h3>Team Details</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <div className="mb-3">
            <p>Advisor Name:</p>
            <p>{advisorName}</p>
          </div>
          <div className="mb-3">
            <p>Advisor Email:</p>
            <p>{advisorEmail}</p>
          </div>
          <div className="mb-3">
            <p>Advisor Phone:</p>
            <p>{advisorPhone}</p>
          </div>
        </div>
        <DataTable
          data={teamUsersTable}
          columns={getSpecificTeamUsersColumns()}
        />
      </div>
      <br />
    </div>
  );
};

function getSpecificTeamUsersColumns() {
  return [
    { name: "First Name", selector: (row) => row.firstname, sortable: true },
    { name: "Last Name", selector: (row) => row.lastname, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    {
      name: "GradDate",
      selector: (row) => constants.gradDateFormat(row.graddate),
      sortable: true,
      sortFunction: constants.dateSort,
    },
  ];
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

export default connect(mapStateToProps, mapDispatchToProps)(SchoolRequests);
