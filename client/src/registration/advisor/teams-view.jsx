/*
  MIT License
  Copyright (c) 2019 KSU-CS-Software-Engineering
  */
  import React, { Component, useState, useEffect } from "react";
  import StatusMessages from "../../_common/components/status-messages/status-messages.jsx";
  import Button from "react-bootstrap/Button";
  import TeamService from "../../_common/services/team";
  import EventService from "../../_common/services/event";
  import UserService from "../../_common/services/user";
  import SchoolService from "../../_common/services/school"
  import DataTable from "react-data-table-component";
  import { connect } from "react-redux";
  import {
    clearErrors,
    updateErrorMsg,
    updateSuccessMsg,
  } from "../../_store/slices/errorSlice.js";
  
  class TeamsView extends Component {
    constructor(props) {
      super(props);
      this.state = {
        teamTable: [],
        eventList: [],
        columnsForAllTeams: this.getAllTeamColumns(),
        competitionId: -1,
        schoolId: -1,
        error: null,
      };
    }
  
    async componentDidMount() {
      try {
        const eventsResponse = await EventService.getAllEvents(this.props.auth.user.id, this.props.auth.user.accessLevel);
        const schoolResponse = await SchoolService.getSchoolFromAdvisor(this.props.advisor.email);
        if (eventsResponse.ok && schoolResponse.ok) {
          const events = eventsResponse.data;
          const schoolId = schoolResponse.data.schoolId;
          this.setMostRecentEventAsCompetitionId(events);
          if (schoolId && this.state.competitionId) {
            const teamsResponse = await TeamService.getTeamSchoolEvent(schoolId, this.state.competitionId);
            if (teamsResponse.ok) {
              this.setState({
                teamTable: teamsResponse.data,
              });
            } else {
              console.error("Error fetching team school event: Response not OK");
              this.setState({ error: "Error fetching team data." });
            }
          }
        } else {
          console.error("Error fetching events");
          this.setState({ error: "Error fetching event data." });
        }
      } catch (error) {
        console.error("Error in componentDidMount", error);
        this.setState({ error: "An unexpected error occurred." });
      }
    }
  
    updateTeams = (nameofevent) => {
      TeamService.getAllTeamsInCompName(nameofevent).then((response) => {
        if (response.ok) {
          this.setState({
            teamTable: response.data,
          });
        } else {
          console.error("Error fetching teams: Response not OK");
          this.setState({ error: "Error fetching team data." });
        }
      }).catch(error => {
        console.error("Error in updateTeams", error);
        this.setState({ error: "An unexpected error occurred." });
      });
    };
  
    reloadAllTeams = () => {
      TeamService.getAllTeams().then((response) => {
        if (response.ok) {
          this.setState({ teamTable: response.data });
        } else {
          console.error("Error reloading all teams");
          this.setState({ error: "Error reloading team data." });
        }
      }).catch(error => {
        console.error("Error in reloadAllTeams", error);
        this.setState({ error: "An unexpected error occurred." });
      });
    };
  
    setMostRecentEventAsCompetitionId = (events) => {
      if (events.length === 0) {
        return;
      }
      const sortedEvents = events.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
      const mostRecentEvent = sortedEvents[0];
      this.setState({ competitionId: mostRecentEvent.id }, () => {
        console.log("Updated competitionId:", this.state.competitionId);
      });
    };
  
    getAllTeamColumns = () => [
      { name: "Team Name", selector: (row) => row.teamname, sortable: true },
      { name: "Skill Level", selector: (row) => row.skilllevel, sortable: true },
    ];
  
    render() {
      const { teamTable, columnsForAllTeams, error } = this.state;
      const table = teamTable.length === 0 ? (
        <h3>No teams to display.</h3>
      ) : (
        <DataTable
          data={teamTable}
          columns={columnsForAllTeams}
          pagination
          paginationPerPage={20}
          paginationRowsPerPageOptions={[20, 30, 40, 50]}
          expandableRows
          expandableRowsComponent={({ data }) => <ExpandedComponent data={data} />}
        />
      );
  
      return (
        <div>
          <StatusMessages />
          <h2>Teams</h2>
          <Button>Add Team</Button>
          {error && <div className="error-message">{error}</div>}
          {table}
        </div>
      );
    }
  }
  
  const ExpandedComponent = ({ data }) => {
    const [teamUsersTable, setTeamUsersTable] = useState([]);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      UserService.getstudentsteam(data.teamname)
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
    }, [data.teamname]);
  
    if (error) {
      return <div className="error-message">{error}</div>;
    }
  
    return <DataTable data={teamUsersTable} columns={getSpecificTeamUsersColumns()} />;
  };
  
  function getSpecificTeamUsersColumns() {
    return [
      { name: "First Name", selector: (row) => row.firstname, sortable: true },
      { name: "Last Name", selector: (row) => row.lastname, sortable: true },
      { name: "Email", selector: (row) => row.email, sortable: true },
      { name: "Phone", selector: (row) => row.phone, sortable: true },
    ];
  }
  
  const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
  });
  
  const mapDispatchToProps = (dispatch) => ({
    dispatchResetErrors: () => dispatch(clearErrors()),
    dispatchError: (message) => dispatch(updateErrorMsg(message)),
    dispatchSuccess: (message) => dispatch(updateSuccessMsg(message)),
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(TeamsView);
  