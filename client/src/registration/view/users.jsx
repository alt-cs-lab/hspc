/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import StatusMessages from "../../_common/components/status-messages/status-messages.jsx";
import UserService from "../../_common/services/user";
// import ReactTable from "react-table";
// import "react-table/react-table.css";
// import "../../../node_modules/react-table/dist/react-table.css"
import { connect } from "react-redux";
// import "../../_common/assets/css/ReactTableCSS.css";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";
import { Table } from "react-bootstrap"

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
        accessor: "firstname"
      },
      {
        Header: "Last Name",
        accessor: "lastname"
      },
      {
        Header: "Email",
        accessor: "email"
      },
      {
        Header: "Phone",
        accessor: "phone"
      },
      {
        Header: "Role",
        accessor: "role"
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
        
        <Table data={this.state.eventTable} columns={this.state.columns}/>

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
