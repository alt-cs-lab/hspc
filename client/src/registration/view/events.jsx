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
const constants = require('../../_utilities/constants');

/*
 * @author: Daniel Bell
 * @Updated: Natalie Laughlin - Viewing the Event Name
 * @Refactored: Trent Powell- Use Data Tables
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
   * Returns a list of all events when the component is rendered.
   */
  componentDidMount = () => {
    EventService.getAllEvents(
      this.props.auth.user.id,
      this.props.auth.user.accessLevel
    )
      .then((response) => {
        if (response.ok) {
          console.log(response.data)
          this.setState({ eventTable: response.data });
        } else console.log("An error has occurred fetching the events, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong fetching the events. Please try again"));
  };

  /*
  * Specifies what information to include in the columns
  */
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
        sortFunction: constants.dateSort,
      },
      {
        name: "Time",
        selector: row => (row.startTime + ' - ' + row.endTime),
      }
    ];
  }
  
  /*
  * Renders the component UI.
  */
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
          expandableRows
          expandableRowsComponent={ExpandedComponent}
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
    dispatchResetErrors: () => dispatch(clearErrors()),
		dispatchError: (message) =>
			dispatch(updateErrorMsg(message)),
		dispatchSuccess: (message) =>
			dispatch(updateSuccessMsg(message))
  };
};

const ExpandedComponent = ({ data }) => {

  return <div>
    <h6>Description:</h6>
    <p>{data.description}</p>
    <p>Teams allowed per School: {data.teamsPerSchool}</p>
    <p>Teams allowed For Event: {data.teamsPerEvent}</p>
  </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewEvents);
