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

/*
 * @author: Tyler Trammell
 * Class that handles the client side viewing of all advisors. UI of View Advisors
 */
class ViewSchools extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.state = {
      advisorTable: [],
      columns: this.getColumns(),
    };
  }

  /*
   * Returns a list of all registered advisors when the component is rendered.
   *
   */
  componentDidMount = () => {
    UserService.getAllAdvisors()
      .then((response) => {
        if (response.ok) {
          this.setState({ advisorTable: response.data });
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
  };

  getColumns() {
    return [
      {
        Header: "First Name",
        selector: row => row.firstname,
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
        name: "School",
        selector: row => row.schoolname
      },
      {
        name: "Phone",
        selector: row => row.phone,
      },
    ];
  }

  /*
   *
   * Renders all the registered advisors in table form
   *
   */
  render() {
    return (
      <div>
        <StatusMessages />
        <p style={{ color: "red", fontSize: "18px", marginTop: "10px" }}>
          *NOTE* Table only displays advisors who have selected their main
          school.
        </p>
        <h2>Advisors</h2>
        <DataTable data={this.state.advisorTable} columns={this.state.columns}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewSchools);
