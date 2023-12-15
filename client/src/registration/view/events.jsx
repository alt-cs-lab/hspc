/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import StatusMessages from "../../_common/components/status-messages/status-messages.jsx";
import EventService from "../../_common/services/event";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import "../../_common/assets/css/ReactTableCSS.css";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";

/*
 * @author: Daniel Bell
 * @Updated: Natalie Laughlin - Viewing the Event Name
 */
class ViewEvents extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.state = {
      eventTable: [],
      columns: this.getColumns(),
    };
  }

  /*
   * Returns a list of all previous events when the component is rendered.
   */
  componentDidMount = () => {
    EventService.getAllEvents(
      this.props.auth.user.id,
      this.props.auth.user.accessLevel
    )
      .then((response) => {
        if (response.ok) {
          this.setState({ eventTable: response.data });
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
  };

  // Specifies what information to include in the columns
  getColumns() {
    return [
      {
        name: "Name",
        selector: row => row.name,
        sortable: true,
      },
      {
        name: "Location",
        selector: row => row.location,
        sortable: true,
      },
      {
        name: "Date (YYYY-MM-DD)",
        selector: row => row.date,
        sortable: true,
        sortFunction: dateSort,
      },
      {
        name: "Time",
        selector: row => row.time,
        sortable: true,
      },
      {
        name: "Description",
        selector: row => row.description
      },
      {
        name: "School Limit",
        selector: row => row.teamsPerSchool
      },
      {
        name: "Event Limit",
        selector: row => row.teamsPerEvent
      },
    ];
  }
  
  // Renders the component UI.
  render() {
    return (
      <div>
        <StatusMessages/>
        <h2>Events</h2>
        <DataTable
          data={this.state.eventTable} 
          columns={this.state.columns} 
          pagination 
          paginationPerPage={20} 
          paginationRowsPerPageOptions={[20, 30, 40, 50]}
        />
      </div>
    );
  }
}

// Sorting method for the date column
const dateSort = (rowA, rowB) => {
  const a = Date.parse(rowA.date);
  const b = Date.parse(rowB.date);
  
  if (a > b){
    return 1;
  }
  if (b > a){
    return -1;
  }
  return 0;
};

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

export default connect(mapStateToProps, mapDispatchToProps)(ViewEvents);
