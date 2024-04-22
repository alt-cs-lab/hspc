/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import TeamService from "../../_common/services/team";
import EventService from "../../_common/services/event";
import SchoolService from "../../_common/services/school";
import StudentService from "../../_common/services/high-school-student";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { connect } from "react-redux";
import {
  clearErrors,
  updateErrorMsg,
  updateSuccessMsg,
} from "../../_store/slices/errorSlice.js";

class ViewTeams extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    /*
    this.advisor =
      props.advisor !== undefined ? this.props.advisor.email : undefined;
    */
    this.state = {
      expanded: {},
      teamName: "",
      teamTable: [],
      filteredTeamsTable: [],
      eventList: [],
      schoolList: [],
      selectedEvent: null,
      selectedSchool: null,
      competitionId: -1,
      schoolId: -1,
      error: null,
      columnsForTeams: this.getAllTeamColumns(),
    };
  }

  /*
   * Returns a list of all registered teams when the component is rendered.
   * If an advisor is logged in, the list of teams registered with that advisor is returned.
   */
  componentDidMount = () => {
    EventService.getPublishedEvents(
      this.props.auth.user.id,
      this.props.auth.user.accessLevel
    )
      .then((response) => {
        let body = response.data;
        let events = [];
        if (response.ok) {
          for (let i = 0; i < body.length; i++) {
            events.push({
              label: body[i].name,
              value: body[i].id,
            });
          }
          this.setState({ eventList: events });
        } else {
          console.log("An error occured, Please try again.");
        }
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));

    SchoolService.getAllSchools()
      .then((response) => {
        let body = response.data;
        let schools = [];
        if (response.ok) {
          for (let i = 0; i < body.length; i++) {
            schools.push({
              label: body[i].name,
              value: body[i].id,
            });
          }
          this.setState({ schoolList: schools });
        } else {
          console.log("An error occured, Please try again");
        }
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));

    TeamService.getAllTeams()
      .then((response) => {
        if (response.ok) {
          this.setState({ teamTable: response.data, filteredTeamsTable: response.data });
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
  };
  /*
   * Updates the list of teams based on selected event
   */
  UpdateTeams = (id, school) => {
    let allTeams = this.state.teamTable;
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
  UpdateTeams(nameofevent) {
    TeamService.getAllTeamsInCompName(nameofevent).then((response) => {
      this.setState({ teamTable: response.data, columns: this.getAllTeamColumns() });
    });
    return;
  }
  */

  // Specifies what information to include in the rendered columns.
  getAllTeamColumns() {
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
        name: "USD",
        selector: (row) => row.usdcode,
        sortable: true,
      },
      {
        name: "Team Status",
        selector: (row) => row.status,
        sortable: true,
      },
      {
        name: "Skill Level",
        selector: (row) => row.skilllevel,
        sortable: true,
      },
      {
        name: "Advisor Email",
        selector: (row) => row.email,
        sortable: true,
      },
    ];
  }

  // This method is used whenever a user wants to see all of the teams again
  reloadAllTeams() {
    TeamService.getAllTeams()
      .then((response) => {
        if (response.ok) {
          this.setState({filteredTeamsTable: response.data, selectedEvent: null, selectedSchool: null,});
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
  }

  handleEventSelection = (selectedOption) => {
    this.setState({ selectedEvent: selectedOption }, () => {
      this.filterTeams();
    });
  };

  handleSchoolSelection = (selectedOption) => {
    this.setState({ selectedSchool: selectedOption }, () => {
      this.filterTeams();
    });
  };

  filterTeams = () => {
    const { teamTable, selectedEvent, selectedSchool } = this.state;
    const filteredTeams = teamTable.filter(team => {
      const eventMatch = selectedEvent ? team.competitionid === selectedEvent.value : true;
      const schoolMatch = selectedSchool ? team.schoolid === selectedSchool.value : true;
      return eventMatch && schoolMatch;
    });

    this.setState({ filteredTeamsTable: filteredTeams });
  };

  // Renders the component.
  render() {
    return (
      <div>
        <h2>Teams</h2>
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
                onChange={(target) => this.handleEventSelection(target)}
                value={this.state.selectedEvent}
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
                placeholder="Select School"
                options={this.state.schoolList}
                onChange={(target) => this.handleSchoolSelection(target)}
                value={this.state.selectedSchool}
              />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "5px", fontSize: "16px" }}>
              View All Teams:
            </span>
            <Button
              id="purple-button"
              className="RegisterButton"
              onClick={() => {
                this.reloadAllTeams();
              }}
            >
              Click Here
            </Button>
          </div>
        </section>
        {/* {table} */}
        <div style={{ marginTop: "1%" }} id="student-data-table">
          <DataTable
            id="student-data-table"
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

// Method that returns a specific team.
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

  return <DataTable data={teamUsersTable} columns={getSpecificTeamUsersColumns()} />;
};

// Once a specific team is chosen the columns are updated by this function.
function getSpecificTeamUsersColumns() {
  return [
    {
      name: "First Name",
      selector: (row) => row.firstname,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.lastname,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
  ];
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
    dispatchError: (message) => dispatch(updateErrorMsg(message)),
    dispatchSuccess: (message) => dispatch(updateSuccessMsg(message)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewTeams);
