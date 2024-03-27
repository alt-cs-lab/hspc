/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import UserService from "../../_common/services/user";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import { FormCheck } from "react-bootstrap";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";
const constants = require('../../_utilities/constants');

const roleTable = {
  "Volunteer": constants.VOLUNTEER,
  "Judge": constants.JUDGE,
  "Advisor": constants.ADVISOR,
  "Admin": constants.ADMIN,
  "Master": constants.MASTER
}

/*
* Component for Admin accounts to view all User accounts 
*/
class ViewUsers extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.state = {
      userData: [],
      filteredUserTable: [],
      columns: this.getColumns(),
      roleFilter: 0,
    };
  }

  // Returns a list of all registered users when the component is rendered.
  componentDidMount = () => {
    UserService.getAllUsers()
      .then((response) => {
        if (response.ok) {
          this.setState({ userData: response.data });
          this.setState({ filteredUserTable: response.data })
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
  };

  /*
  * Function to filter users by roles.
  */
  RoleFilter(role) {
    let roleFilter = this.state.roleFilter
    let activeRoles = constants.ADMIN + constants.ADVISOR + constants.JUDGE + constants.VOLUNTEER;

    if( (roleFilter & role) === (activeRoles & role) ){
      activeRoles = roleFilter & (activeRoles - role)
      this.setState({ roleFilter: activeRoles })
    }
    else{
      activeRoles = roleFilter | role
      this.setState({ roleFilter: activeRoles })
    }
    
    let allUsers = this.state.userData;
    let filteredUsers = []
    for (let i = 0; i < allUsers.length; i++) {
      if( activeRoles !== 0 && (activeRoles & roleTable[allUsers[i].Role]) > 0){
        filteredUsers.push(allUsers[i])
      }
      else if( activeRoles === 0) {
        filteredUsers.push(allUsers[i])
      }
    }

    this.setState({ filteredUserTable: filteredUsers })
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
      <div id="student-data-table">
        <h2>Users</h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
            <span style={{ marginRight: "5px", fontSize: "16px" }}>
              Filter Volunteers:
            </span>
            <FormCheck onChange={() => { this.RoleFilter(constants.VOLUNTEER) }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
            <span style={{ marginRight: "5px", fontSize: "16px" }}>
              Filter Judges:
            </span>
            <FormCheck onChange={() => { this.RoleFilter(constants.JUDGE) }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
            <span style={{ marginRight: "5px", fontSize: "16px" }}>
              Filter Advisors:
            </span>
            <FormCheck onChange={() => { this.RoleFilter(constants.ADVISOR) }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
            <span style={{ marginRight: "5px", fontSize: "16px" }}>
              Filter Admin:
            </span>
            <FormCheck onChange={() => { this.RoleFilter(constants.ADMIN) }} />
          </div>
        </div>
        <DataTable
          data={this.state.filteredUserTable} 
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
