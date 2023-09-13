/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import StatusMessages from "../../_common/components/status-messages/status-messages.jsx";
import UserService from "../../_common/services/user";
import ReactTable from "react-table";
import "react-table/react-table.css";
import {
  UPDATE_SUCCESS_MSG,
  UPDATE_ERROR_MSG,
  CLEAR_ERRORS,
} from "../../_store/actions/types";
import { connect } from "react-redux";
import "../../_common/assets/css/ReactTableCSS.css";


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
        if (response.statusCode === 200) {
          this.setState({ userTable: JSON.parse(response.body) }, () => {});
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
        Header: "First Name",
        accessor: "firstname",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "Last Name",
        accessor: "lastname",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "Phone",
        accessor: "phone",
        Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
      },
      {
        Header: "Role",
        accessor: "role",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
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
        <h2>Users</h2>
        <ReactTable
          filterable
          className="-striped -highlight"
          defaultFilterMethod={this.filterMethod}
          data={this.state.userTable}
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
    dispatchResetErrors: () => dispatch({ type: CLEAR_ERRORS }),
    dispatchError: (message) =>
      dispatch({ type: UPDATE_ERROR_MSG, payload: message }),
    dispatchSuccess: (message) =>
      dispatch({ type: UPDATE_SUCCESS_MSG, payload: message }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewUsers);
