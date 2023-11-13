/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import StatusMessages from "../../../_common/components/status-messages/status-messages.jsx";
import EventService from "../../../_common/services/event.js";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import "../../../_common/assets/css/ReactTableCSS.css";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../../_store/slices/errorSlice.js";

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
        console.log(response.data)
        if (response.ok) {
          this.setState({ eventTable: response.data });
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
  };

  getColumns() {
    return [
      {
        name: "Name",
        selector: row => row.name
      },
      {
        name: "Location",
        selector: row => row.location
      },
      {
        name: "Date",
        selector: row => row.date
      },
      {
        name: "Time",
        selector: row => row.time
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
  /*
   * Renders the component UI.
   */
  render() {
    return (
      <div>
        <StatusMessages />
        <h2>Events</h2>
        <DataTable data={this.state.eventTable} columns={this.state.columns}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewEvents);
