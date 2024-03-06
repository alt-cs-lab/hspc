/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import StatusMessages from "../../_common/components/status-messages/status-messages.jsx";
import SchoolService from "../../_common/services/school";
import StudentService from "../../_common/services/high-school-student";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";
import Select from "react-select";
import { Button } from "react-bootstrap";
// import { getAllStudents } from "../../_common/services/high-school-student.js";

// This class inherits functionality of the Component class and extends it.
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
      schoolId: -1,
    };
  }

  // Updates advisor's schools and the schools' students when the component is rendered.
  componentDidMount = () => {
    // Get Advisor's Schools
    SchoolService.getAdvisorSchools(this.advisor.id)
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
    StudentService.getAdvisorsStudents( this.advisor.id )
    .then((response) => {
        if (response.ok) {
          this.setState({ studentList: response.data });
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
        name: "Email",
        selector: row => row.email,
        sortable: true,
      },
      {
        name: "Graduation Date",
        selector: row => row.graddate,
        sortable: true,
      }
    ];
  }

  UpdateStudents = (id, school) => {
    this.setState({ schoolId: id })
    
    let allStudents = this.state.studentList;
    let filteredStudents = [];
    for (let i = 0; i < allStudents.length; i++) {
      if( allStudents[i].schoolid === id ){
        filteredStudents.push(allStudents[i]);
      }
    }
    this.setState({ filteredStudentTable: filteredStudents })
  };
  
  // Renders the component.
  render() {
    return (
      <div>
        <StatusMessages/>
        <h2> Students </h2>
        <Button className="mb-3"> Add Student </Button>
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
                  id="event-dropdown"
                  placeholder="Select School"
                  options={this.state.schoolList}
                  onChange={target => this.UpdateStudents(target.value)}
                />
              </div>
          </div>
        </section>
        <DataTable
            data={this.state.filteredStudentTable} 
            columns={this.state.columnsForStudents} 
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
			dispatch(updateSuccessMsg(message)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewStudents);
