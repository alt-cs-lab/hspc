/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component, useState, useEffect } from "react";
import StatusMessages from "../../_common/components/status-messages/status-messages.jsx";
import Button from 'react-bootstrap/Button';
import TeamService from "../../_common/services/team";
import EventService from "../../_common/services/event";
import UserService from "../../_common/services/user";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";


class ViewTeams extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.advisor =
      props.advisor !== undefined ? this.props.advisor.email : undefined;
    this.state = {
      expanded: {},
      teamName: "",
      teamTable: [],
      eventList: [],
      columnsForAllTeams: this.getAllTeamColumns(),
    };
  }

  /*
   * Returns a list of all registered teams when the component is rendered.
   * If an advisor is logged in, the list of teams registered with that advisor is returned.
   */
  componentDidMount = () => {
    TeamService.getAllTeams()
      .then((response) => {
        if (response.ok) {
          this.setState({ teamTable: response.data });
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));

    EventService.getAllEvents(
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
              value: body[i].name,
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
   * Updates the list of teams based on selected event
   */
  UpdateTeams(nameofevent) {
    TeamService.getAllTeamsInCompName(nameofevent).then((response) => {
      this.setState({ teamTable: response.data, columns: this.getAllTeamColumns() });
    });
    return;
  }

  // Specifies what information to include in the rendered columns.
  getAllTeamColumns() {
    return [
      {
        name: "Team Name",
        selector: row => row.teamname,
        sortable: true,
      },
      {
        name: "School Name",
        selector: row => row.schoolname,
        sortable: true,
      },
      {
        name: "Address Line 1",
        selector: row => row.addressline1,
        sortable: true,
      },
      {
        name: "Address Line 2",
        selector: row => row.addressline2,
        sortable: true,
      },
      {
        name: "City",
        selector: row => row.city,
        sortable: true,
      },
      {
        name: "State",
        selector: row => row.State,
        sortable: true,
      },
      {
        name: "USD",
        selector: row => row.usdcode,
        sortable: true,
      },
      {
        name: "Question Level",
        selector: row => row.questionlevel,
        sortable: true,
      },
      {
        name: "Email",
        selector: row => row.email,
        sortable: true,
      },
    ];
  }

  // This method is used whenever a user wants to see all of the teams again
  reloadAllTeams() {
    TeamService.getAllTeams()
      .then((response) => {
        if (response.ok) {
          this.setState({ teamTable: response.data });
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
    }

  // Renders the component.
  render() {
    const table = this.state.teamTable.length === 0 ? 
      <h3>No teams to display.</h3>: 
      <DataTable
        data={this.state.teamTable} 
        columns={this.state.columnsForAllTeams} 
        pagination 
        paginationPerPage={20} 
        paginationRowsPerPageOptions={[20, 30, 40, 50]}
        expandableRows
        expandableRowsComponent={ExpandedComponent}
      />
    return (
      <div>
        <StatusMessages />
        <h2>Teams</h2>
        <section
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <div style={{display:"flex", alignItems:"center"}}>
            <span style={{ marginRight: "5px", fontSize: "16px" }}>
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
          <div style={{display:"flex", alignItems:"center"}}>
            <span style={{marginRight:"5px", fontSize:"16px"}}>
              View All Teams:
            </span>
            <Button
              variant="primary"
              className="RegisterButton"
              style={{
                margin: 15,
                backgroundColor: "#00a655",
                color: "white",
                fontSize: 14,
              }}
              onClick={() => {
                this.reloadAllTeams()
              }}
            >
              Click Here
            </Button>
          </div>
        </section>
        {table}
      </div>
    );
  }
}

// Method that returns a specific team.
const ExpandedComponent = ({ data }) => {
  var columnsForSpecficTeams = getSpecficTeamUsersColumns();
  const [teamUsersTable, setTeamUsersTable] = useState([]);
  useEffect(() => {
    UserService.getstudentsteam(data.teamname)  
    .then((response) => {
      if (response.ok) {
        console.log(response.data)
        setTeamUsersTable(response.data);
      } else console.log("An error has occurred, Please try again.");
    })
    .catch((resErr) => console.log("Something went wrong. Please try again"));
  })
  
  return (
    <DataTable
      data={teamUsersTable} 
      columns={columnsForSpecficTeams}
    />
  );
};

// Once a specific team is chosen the columns are updated by this function.
function getSpecficTeamUsersColumns() {
  return [
    {
      name: "First Name",
      selector: row => row.firstname,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: row => row.lastname,
      sortable: true,
    },
    {
      name: "Email",
      selector: row => row.email,
      sortable: true,
    },
    {
      name: "Phone",
      selector: row => row.phone,
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
		dispatchError: (message) =>
			dispatch(updateErrorMsg(message)),
		dispatchSuccess: (message) =>
			dispatch(updateSuccessMsg(message))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewTeams);
