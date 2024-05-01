/**
 * Author: Devan Griffin
 * Modified: 4/22/24
 */
import React, { Component } from "react";
import SchoolService from "../../_common/services/school";
import StudentService from "../../_common/services/high-school-student";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";
import Select from "react-select";
import { Button, FormCheck } from "react-bootstrap";
import AddStudent from "../create/add-high-school-student.jsx";
import EditStudent from "../edit/high-school-students.jsx";
import "../../_common/assets/css/standard.css";

const constants = require('../../_utilities/constants');

/**
 * A component for viewing an advisor's students
 */
class ViewStudents extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.advisor = this.props.auth.user;
    this.state = {
      studentList: [],
      filteredStudentTable: [],
      columnsForStudents: this.getColumns(),
      schoolList: [],
      schoolid: -1,
      gradFilter: true
    };
  }

  /**
   * Runs when the component is opened
   * Gets all the schools and students from the database that are attatched to the advisor
   */
  componentDidMount = () => {
    SchoolService.getAdvisorApprovedSchools(this.advisor.id)
    .then((response) => {
        if (response.ok) {
            let schoolbody = response.data;
            let schools = [];
            for (let i = 0; i < schoolbody.length; i++) {
                schools.push({
                    label: schoolbody[i].schoolname,
                    value: schoolbody[i].schoolid,
                });
            }
            this.setState({ schoolList: schools })
        } else console.log("An error has occurred fetching schools, Please try again.");
    })
    .catch((resErr) => console.log("Something went wrong fetching schools. Please try again"));
    
    StudentService.getAdvisorsStudents( this.advisor.id )
    .then((response) => {
        if (response.ok) {
          this.setState({ studentList: response.data });
        } else console.log("An error has occurred fetching students, Please try again.");
    })
    .catch((resErr) => console.log("Something went wrong fetching students. Please try again"))
  };

  /**
   * Columns for the data table
   */
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
        name: "Graduation Date",
        selector: row => constants.gradDateFormat(row.graddate),
        sortable: true,
        sortFunction: constants.dateSort,
      },
      {
        name: "Edit Student",
        cell: row => <Button onClick={() => this.props.setCurrentView(<EditStudent advisor={this.advisor.id} student={row} 
              setCurrentView={this.props.setCurrentView}/>)}>Edit</Button>,
        button: true,
      }
    ];
  }

  /**
   * Updates the students based off of the selected school and graduated check mark
   * @param {int?} id The school id
   * @param {boolean?} gradFilter If the graduated box is checked
   */
  UpdateStudents = (id, gradFilter) => {
    if( id != null){
      this.setState({ schoolid: id })
    }
    else{
      id = this.state.schoolid
    }
    if( gradFilter != null ){
      this.setState({ gradFilter: gradFilter })
    }
    else{
      gradFilter = this.state.gradFilter
    }
    let today = new Date();
    
    let allStudents = this.state.studentList;
    let filteredStudents = [];
    for (let i = 0; i < allStudents.length; i++) {
      if( allStudents[i].schoolid === id ){
        if( gradFilter && constants.dateFormat(allStudents[i].graddate).substring(0,7).localeCompare(constants.toDatabaseDate(today.getFullYear(), today.getMonth(), 28).substring(0,7)) === 1){
          filteredStudents.push(allStudents[i]);
        }
        else if( !gradFilter ) {
          filteredStudents.push(allStudents[i]);
        }
      }
    }
    this.setState({ filteredStudentTable: filteredStudents })
  };
  
  /**
   * Draws the component
   */
  render() {
    return (
      <div>
        <h2> Students </h2>
        <Button className="mb-3"
          onClick={() => this.props.setCurrentView(<AddStudent advisorUser={this.advisor.id} setCurrentView={this.props.setCurrentView}/>)}>
            Add Student 
        </Button>
        <section
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <div style={{display:"flex", alignItems:"center"}}>
              <span style={{ marginRight: "5px", fontSize: "16px" }}>
                Select School:
              </span>
              <div id="sub-nav" className="schoolDropdown">
                <Select
                    className="m-3"
                    id="school-dropdown"
                    placeholder="Select School"
                    options={this.state.schoolList}
                    onChange={target => this.UpdateStudents(target.value, null)}
                  />
              </div>
              <span style={{ marginRight: "5px", fontSize: "16px" }}>
                Graduates Excluded:
              </span>
              <FormCheck defaultChecked={true} 
              onChange={() => { this.UpdateStudents(null, !this.state.gradFilter) }} />
          </div>
        </section>
        <br/>
        <div id="student-data-table">
          <DataTable data={this.state.filteredStudentTable} columns={this.state.columnsForStudents} 
              pagination paginationPerPage={20} paginationRowsPerPageOptions={[20, 30, 40, 50]}/>
        </div>
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
			dispatch(updateSuccessMsg(message)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewStudents);
