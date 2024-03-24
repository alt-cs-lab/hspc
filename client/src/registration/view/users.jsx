/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import UserService from "../../_common/services/user";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";

// This class inherits functionality of the Component class and extends it.
class ViewUsers extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.state = {
      userTable: [],
      columns: this.getColumns(),
    };
  }

  // Returns a list of all registered users when the component is rendered.
  componentDidMount = () => {
    UserService.getAllUsers()
      .then((response) => {
        if (response.ok) {
          console.log(response.data)
          this.setState({ userTable: response.data });
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
  };

  // TODO: Update this method so that it is usable.
  filterMethod = (filter, row, column) => {
    const id = filter.pivotId || filter.id;

    return row[id] !== undefined
      ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
      : true;
  };

  // Specifies what information to include in the rendered columns.
  getColumns() {
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
      {
        name: "Role",
        selector: row => row.Role,
        sortable: true,
      },
    ];
  }
  
  // Renders the component.
  render() {
    return (
      <div>
        <h2>Users</h2>
        <DataTable
          data={this.state.userTable} 
          columns={this.state.columns} 
          pagination 
          paginationPerPage={20} 
          paginationRowsPerPageOptions={[20, 30, 40, 50]}
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewUsers);
