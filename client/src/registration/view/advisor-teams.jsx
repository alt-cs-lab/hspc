/**
 * View advisor teams page
 * Author:
 * Modified: 5/1/2024
 */
import React, { Component, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import TeamService from "../../_common/services/team.js";
import EventService from "../../_common/services/event.js";
import StudentService from "../../_common/services/high-school-student.js";
import SchoolService from "../../_common/services/school.js";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { connect } from "react-redux";
import CreateTeam from "../create/team.jsx";
import {
  clearErrors,
  updateErrorMsg,
  updateSuccessMsg,
} from "../../_store/slices/errorSlice.js";

const constants = require("../../_utilities/constants.js");

/*
 * Page to view an advisor's schools' teams
 */
class AdvisorTeamsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamList: [],
      filteredTeamsTable: [],
      columnsForTeams: this.getAllTeamColumns(),
      eventList: [],
      schoolList: [],
      competitionId: -1,
      schoolId: -1,
      error: null,
    };
  }

  componentDidMount = () => {
    /*
     * Get Events
     */
    EventService.getPublishedEvents(
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

    /*
     * Get Advisor's Approved Schools
     */
    SchoolService.getAdvisorApprovedSchools(
      this.props.auth.user.id,
      this.props.auth.user.accessLevel
    )
      .then((response) => {
        if (response.ok) {
          let schoolbody = response.data;
          let schools = [];
          for (let i = 0; i < schoolbody.length; i++) {
            schools.push({
              label: schoolbody[i].schoolname,
              value: schoolbody[i].schoolid,
            });
          }
          this.setState({ schoolList: schools });
        } else
          console.log(
            "An error has occurred fetching schools, Please try again."
          );
      })
      .catch((resErr) =>
        console.log("Something went wrong fetching schools. Please try again")
      );

    /*
     * Get Teams for Advisor's Schools
     */
    TeamService.getAdvisorsTeams(this.props.auth.user.id)
      .then((response) => {
        if (response.ok) {
          this.setState({ teamList: response.data });
        } else
          console.log(
            "An error has occurred fetching teams, Please try again."
          );
      })
      .catch((resErr) =>
        console.log("Something went wrong fetching teams. Please try again")
      );
  };

  /*
   * Update Teams when a filter of school or event changes
   */
  UpdateTeams = (id, school) => {
    let allTeams = this.state.teamList;
    let filteredTeams = [];
    if (school) {
      this.setState({ schoolId: id });
      for (let i = 0; i < allTeams.length; i++) {
        if (
          allTeams[i].schoolid === id &&
          allTeams[i].competitionid === this.state.competitionId
        ) {
          filteredTeams.push(allTeams[i]);
        }
      }
    } else {
      this.setState({ competitionId: id });
      for (let i = 0; i < allTeams.length; i++) {
        if (
          allTeams[i].schoolid === this.state.schoolId &&
          allTeams[i].competitionid === id
        ) {
          filteredTeams.push(allTeams[i]);
        }
      }
    }
    this.setState({ filteredTeamsTable: filteredTeams });
  };

  /*
   * Specifies what information to include in the columns
   */
  getAllTeamColumns() {
    return [
      {
        name: "Team Name",
        selector: (row) => row.teamname,
        sortable: true,
      },
      {
        name: "Question Level",
        selector: (row) => row.skilllevel,
        sortable: true,
      },
      {
        name: "Team Status",
        selector: (row) => row.status,
        sortable: true,
      },
    ];
  }

  render() {
    return (
      <div>
        <h2>Teams</h2>
        <Button
          id="purple-button"
          onClick={() =>
            this.props.setCurrentView(
              <CreateTeam advisor={this.props.advisor} />
            )
          }
        >
          Add Team
        </Button>
        <section
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "5px", fontSize: "16px" }}>
              Select Event:
            </span>
            <div id="sub-nav" className="eventDropDown">
              <Select
                id="event-dropdown"
                placeholder="Select Event"
                options={this.state.eventList}
                onChange={(target) => this.UpdateTeams(target.value, false)}
              />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "5px", fontSize: "16px" }}>
              Select School:
            </span>
            <div id="sub-nav" className="schoolDropdowm">
              <Select
                id="event-dropdown"
                placeholder="Select Event"
                options={this.state.schoolList}
                onChange={(target) => this.UpdateTeams(target.value, true)}
              />
            </div>
          </div>
        </section>
        {/* {table} */}
        <div className="mt-3" id="student-data-table">
          <DataTable
            data={this.state.filteredTeamsTable}
            columns={this.state.columnsForTeams}
            pagination
            paginationPerPage={20}
            paginationRowsPerPageOptions={[20, 30, 40, 50]}
            expandableRows
            expandableRowsComponent={ExpandedComponent}
          />
        </div>
      </div>
    );
  }
}

const ExpandedComponent = ({ data }) => {
  const [teamUsersTable, setTeamUsersTable] = useState([]);
  const [error, setError] = useState(null);

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
  }, [data.teamid]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <DataTable data={teamUsersTable} columns={getSpecificTeamUsersColumns()} />
  );
};

function getSpecificTeamUsersColumns() {
  return [
    { name: "First Name", selector: (row) => row.firstname, sortable: true },
    { name: "Last Name", selector: (row) => row.lastname, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    {
      name: "Graduation Date",
      selector: (row) => constants.gradDateFormat(row.graddate),
      sortable: true,
      sortFunction: constants.dateSort,
    },
  ];
}

/**
 * Redux initializes props.
 */
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

/**
 * Redux updates props.
 */
const mapDispatchToProps = (dispatch) => ({
  dispatchResetErrors: () => dispatch(clearErrors()),
  dispatchError: (message) => dispatch(updateErrorMsg(message)),
  dispatchSuccess: (message) => dispatch(updateSuccessMsg(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdvisorTeamsView);
