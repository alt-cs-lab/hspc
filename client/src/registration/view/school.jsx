/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
//import { Table } from "react-bootstrap";
import StatusMessages from "../../_common/components/status-messages/status-messages.jsx";
import SchoolService from "../../_common/services/school";
import {Table} from "react-bootstrap"
// import ReactTable from "react-table";
// import "react-table/react-table.css";
import { connect } from "react-redux";
import "../../_common/assets/css/ReactTableCSS.css";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";

var currentView = null;

/*
 * @author: Tyler Trammell
 * Class that handles the client side viewing of all schools. UI of View Schools
 */
class ViewSchools extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.state = {
      schoolTable: [],
      columns: this.getColumns(),
    };
  }

  /*
   * Returns a list of all registered schools when the component is rendered.
   *
   */
  componentDidMount = () => {
    SchoolService.getAllSchools()
      .then((response) => {
        var data = JSON.parse(response.body);
        if (response.statusCode === 200) {
          this.setState({ schoolTable: data }, () => {
            this.generateSchoolTable(); // helper function
          });
        } else if (response.statusCode === 200) {
          var registeredSchools = [];
          data.forEach((school, index) => {
            registeredSchools.push({
              ID: index,
              SchoolName: school.SchoolName,
              AddressLine1: school.AddressLine1,
              AddressLine2: school.AddressLine2,
              City: school.City,
              State: school.State,
              PostalCode: school.PostalCode,
              USDCode: school.USDCode,
            });
          });
          this.setState({ schoolTable: registeredSchools }, () => {
            this.generateSchoolTable(); // helper function
          });
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
  };

  /*
   * Helper function for handleShowSchools. Generates the data as a table. TODO: This isn't needed???
   */
  generateSchoolTable() {
    const schools = [];
    this.state.schoolTable.forEach((school, index) => {
      schools.push(
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{school.schoolname}</td>
          <td>{school.addressline1}</td>
          <td>{school.addressline2}</td>
          <td>{school.city}</td>
          <td>{school.State}</td>
          <td>{school.postalcode}</td>
          <td>{school.usdcode}</td>
        </tr>
      );
    });
    currentView = (
      <table id="table_id" class="display">
        <thead>
          <tr>
            <th>#</th>
            <th>School</th>
            <th>Address Line 1</th>
            <th>Address Line 2</th>
            <th>City</th>
            <th>State</th>
            <th>Zip Code</th>
            <th>USD Code</th>
          </tr>
        </thead>
        <tbody>{schools}</tbody>
      </table>
    );
    this.forceUpdate();
  }
  /* 
    This method maps the database call and the columns to the correct positioning
  */
  getColumns() {
    return [
      {
        Header: "State",
        accessor: "State",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
        /*           filterMethod: (filter, rows, column) =>
          String(rows[filter.id]).includes(filter.value),
          filterable: true
          filterAll: true */
      },
      {
        Header: "School Name",
        accessor: "schoolname",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "Address Line 1",
        accessor: "addressline1",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "Address Line 2",
        accessor: "addressline2",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "City",
        accessor: "city",
        Cell: (row) => <div style={{ textAlign: "left" }}>{row.value}</div>,
      },
      {
        Header: "USD Code",
        accessor: "usdcode",
        Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
      },
      {
        Header: "Postal Code",
        accessor: "postalcode",
        Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
      },
    ];
  }
  /*
   *
   * Renders all the registered schools in table form
   *
   */
  render() {
    return (
      <div>
        <StatusMessages />
        <h2>Schools</h2>
        <Table data={this.state.eventTable} columns={this.state.columns}></Table>
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
