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

var currentView = null;

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
        var data = JSON.parse(response.body);
        if (response.statusCode === 200) {
          this.setState({ advisorTable: data }, () => {});
        } else if (response.statusCode === 200) {
          var registeredAdvisors = [];
          data.forEach((advisor, index) => {
            registeredAdvisors.push({
              ID: index,
              FirstName: advisor.FirstName,
              LastName: advisor.LastName,
              Email: advisor.Email,
              School: advisor.SchoolName,
            });
          });
          this.setState({ advisorTable: registeredAdvisors }, () => {});
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
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
        Header: "School",
        accessor: "schoolname",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "Phone",
        accessor: "phone",
        Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
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
        <ReactTable
          filterable
          className="-striped -highlight"
          data={this.state.advisorTable}
          columns={this.state.columns}
          minRows={10}
          style={{ margin: "0px 60px" }}
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewSchools);
