/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import StatusMessages from "../../../_common/components/status-messages/status-messages.jsx";
import SchoolService from "../../../_common/services/school.js";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../../_store/slices/errorSlice.js";
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
        if (response.ok) {
          this.setState({ schoolTable: response.data });
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
  };
  /* 
    This method maps the database call and the columns to the correct positioning
  */
  getColumns() {
    return [
      {
        name: "State",
        selector: row => row.state,
      },
      {
        name: "School Name",
        selector: row => row.name,
      },
      {
        name: "Address Line 1",
        selector: row => row.addressLine1,
      },
      {
        name: "Address Line 2",
        selector: row => row.addressLine2,
      },
      {
        name: "City",
        selector: row => row.city,
      },
      {
        name: "USD Code",
        selector: row => row.usdCode,
      },
      {
        name: "Postal Code",
        selector: row => row.postalCode,
      },
    ];
  }
  /*
   * Renders all the registered schools in table form
   */
  render() {
    return (
      <div>
        <StatusMessages />
        <h2>Schools</h2>
        <DataTable data={this.state.schoolTable} columns={this.state.columns}/>
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
