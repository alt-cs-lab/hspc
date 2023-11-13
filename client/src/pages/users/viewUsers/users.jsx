/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import StatusMessages from "../../../_common/components/status-messages/status-messages.jsx";
import UserService from "../../../_common/services/user.js";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../../_store/slices/errorSlice.js";

class ViewUsers extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.state = {
      userTable: [],
      columns: this.getColumns(),
    };
  }

  /*
   * Returns a list of all registered users when the component is rendered.
   */
  componentDidMount = () => {
    UserService.getAllUsers()
      .then((response) => {
        if (response.ok) {
          this.setState({ userTable: response.data });
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
  };

  filterMethod = (filter, row, column) => {
    const id = filter.pivotId || filter.id;

    return row[id] !== undefined
      ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
      : true;
  };

  getColumns() {
    return [
      {
        name: "First Name",
        selector: row => row.firstname,
        cell: row => { 
          return (
            <div style={{textAlign: "left"}}>{row.key}</div>
          );
        },
      },
      {
        name: "Last Name",
        selector: row => row.lastname,
      },
      {
        name: "Email",
        selector: row => row.email,
      },
      {
        name: "Phone",
        selector: row => row.phone,
      },
      {
        name: "Role",
        selector: row => row.role,
      },
    ];
  }
  /*
   * Renders the component UI.
   */
  render() {
    return (
      <div>
        <StatusMessages/>
        <h2>Users</h2>
        <DataTable data={this.state.userTable} columns={this.state.columns}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewUsers);
