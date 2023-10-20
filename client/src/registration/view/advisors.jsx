/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import StatusMessages from "../../_common/components/status-messages/status-messages.jsx";
import UserService from "../../_common/services/user";
import { Table } from "react-bootstrap";
// import ReactTable from "react-table";
// import "react-table/react-table.css";
import { connect } from "react-redux";
import "../../_common/assets/css/ReactTableCSS.css";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";

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
        <Table data={this.state.evenTable} columns={this.state.columns}>
        </Table>
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
