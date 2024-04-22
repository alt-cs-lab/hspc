/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import SchoolService from "../../_common/services/school";
import StudentService from "../../_common/services/high-school-student";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";
import Select from "react-select";
import { Button, FormCheck } from "react-bootstrap";
import "../../_common/assets/css/standard.css";
import EditStudent from "../edit/high-school-students.jsx";

const constants = require('../../_utilities/constants');

// This class inherits functionality of the Component class and extends it.
class ViewAllStudents extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.user = this.props.auth.user;
    this.state = {
      studentList: [],
      filteredStudentTable: [],
      columnsForStudents: this.getColumns(),
      schoolList: [],
      schoolid: -1,
      selectedSchool: null,
      gradFilter: true,
      requestLevel: constants.MASTER,
    };
  }

  // Updates advisor's schools and the schools' students when the component is rendered.
  componentDidMount = () => {
    // Get All Schools
    SchoolService.getAllSchools()
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

    // Get Students For Advisor's Schools
    StudentService.getAllStudents()
    .then((response) => {
        if (response.ok) {
          let allStudents = response.data;
          let filteredStudents = [];         
          let today = new Date();

          for (let i = 0; i < allStudents.length; i++) {
            if (constants.dateFormat(allStudents[i].graddate).substring(0,7).localeCompare(constants.toDatabaseDate(today.getFullYear(), today.getMonth(), 28).substring(0,7)) === 1){
              filteredStudents.push(allStudents[i]);
            }
          }

          this.setState({ studentList: allStudents, filteredStudentTable: filteredStudents });
        } else console.log("An error has occurred fetching students, Please try again.");
    })
    .catch((resErr) => console.log("Something went wrong fetching students. Please try again"))

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
        name: "School",
        selector: row => row.schoolname,
        sortable: true
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
        cell: row => <Button onClick={() => this.props.setCurrentView(<EditStudent admin={true} student={row}/>)}>Edit</Button>,
        button: true
      }
    ];
  }

  ResetTable = () => {
    this.setState({ filteredStudentTable: this.state.studentList, selectedSchool: null });
  }

  UpdateStudents = (target, filter) => {
    let id = null
    if ( target !== null && target.value !== null) {
      id = target.value
      this.setState({ schoolid: id, selectedSchool: target });
    }
    else if (gradFilter != null) {
      id = this.state.schoolid;
      this.setState({ gradFilter: gradFilter });
    }

    this.HandleGradCheck(id, gradFilter);
  };

  HandleGradCheck = (id, gradFilter) => {
    let today = new Date();
    let allStudents = this.state.studentList;
    let filteredStudents = [];
    console.log(id);
    for (let i = 0; i < allStudents.length; i++) {
      if (allStudents[i].schoolid === id || id === -1) {
        if (gradFilter && constants.dateFormat(allStudents[i].graddate).substring(0,7).localeCompare(constants.toDatabaseDate(today.getFullYear(), today.getMonth(), 28).substring(0,7)) === 1){
          filteredStudents.push(allStudents[i]);
          console.log(allStudents[i]);
        }
        else if (!gradFilter) {
          filteredStudents.push(allStudents[i]);
        }
      }
    }

    this.setState({ filteredStudentTable: filteredStudents })
  }
  
  // Renders the component.
  render() {
    return (
      <div>
        <h2> Students </h2>
        {/* <Button className="mb-3" id="purple-button"
          onClick={() => this.props.setCurrentView(<AddStudent advisorUser={this.advisor.id}/>)}>
            Add Student 
        </Button> */}
        <section
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}>
            <div style={{display:"flex", alignItems:"center"}}>
                <span style={{ marginRight: "5px", fontSize: "16px" }}>
                    Select School:
                </span>
                <div id="sub-nav">
                <Select
                    className="m-3"
                    placeholder="Select School"
                    options={this.state.schoolList}
                    onChange={target => this.UpdateStudents(target, null)}
                    value={this.state.selectedSchool}
                  />
                </div>
                <span style={{ marginRight: "5px", fontSize: "16px" }}>
                    Graduates Excluded:
                </span>
                <FormCheck defaultChecked={true}
                    onChange={() => { this.UpdateStudents(null, !this.state.gradFilter) }} />
                <Button className="m-3" onClick={() => { this.ResetTable() }}>
                    View All Students
                </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewAllStudents);
