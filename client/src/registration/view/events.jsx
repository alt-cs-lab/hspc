/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import StatusMessages from "../../_common/components/status-messages/status-messages.jsx";
import EventService from "../../_common/services/event";
import ReactTable from "react-table";
// import "react-table/react-table.css";
import { connect } from "react-redux";
import "../../_common/assets/css/ReactTableCSS.css";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";

var currentView = null;

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
        if (response.statusCode === 200) {
          this.setState({ eventTable: response.body });
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
  };

  getColumns() {
    return [
      {
        Header: "Name",
        accessor: "eventname",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "Location",
        accessor: "eventlocation",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "Date",
        accessor: "eventdate",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "Time",
        accessor: "eventtime",
        Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
      },
      {
        Header: "Description",
        accessor: "eventdescription",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "School Limit",
        accessor: "teamsperschool",
        Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
      },
      {
        Header: "Event Limit",
        accessor: "teamsperevent",
        Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
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
        <ReactTable
          filterable
          className="-striped -highlight"
          data={this.state.eventTable}
          columns={this.state.columns}
          minRows={10}
          style={{ margin: "20px 60px" }}
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewEvents);
