/**
 * Author: Devan Griffin
 * Modified: 4/24/2024
 */
import React, { Component } from "react";
import SchoolService from "../../_common/services/school.js";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";

/**
 * Component for viewing all the schools
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

  
  /**
   * Runs when the component is opened
   * Gets all the schools from the database
   */
  componentDidMount = () => {
    SchoolService.getAllSchools()
      .then((response) => {
        if (response.ok) {
          this.setState({ schoolTable: response.data });
        } else console.log("An error has occurred retrieving schools, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong retrieving schools. Please try again"));
  };

  /**
   * Gets all the columns for the data table
   */
  getColumns() {
    return [
      {
        name: "USD Code",
        selector: row => row.usdcode,
        sortable: true,
      },
      {
        name: "School Name",
        selector: row => row.schoolname,
        sortable: true,
      },
      {
        name: "City",
        selector: row => row.city,
        sortable: true,
      },
      {
        name: "State",
        selector: row => row.state,
        sortable: true,
      },
      {
        name: "Postal Code",
        selector: row => row.postalcode,
        sortable: true,
      },
    ];
  }
  
  
  /**
   * Draws the component
   */
  render() {
    return (
      <div id="student-data-table">
        <h2>Schools</h2>
        <DataTable
          data={this.state.schoolTable} 
          columns={this.state.columns} 
          pagination 
          paginationPerPage={20} 
          paginationRowsPerPageOptions={[20, 30, 40, 50]}
          expandableRows
          expandableRowsComponent={ExpandedComponent}
        />
      </div>
    );
  }
}

/**
 * Maps the states to props to be used in connect wrapper in export
 */
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

/**
 * The expanded component when the dropdown is click on the data table
 * Displays the address
 */
const ExpandedComponent = ({ data }) => {
  return <div>
    <h6>Address:</h6>
    <p>{data.addressLine1}</p>
    <p>{data.addressLine2}</p>
  </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewSchools);
