/*
Name: Devin Richards
Created On: 02/07/2024
Last Modified: 02/12/2024
*/
// PURPOSE: This page is used by an advisor to register a team.
/* 
TODO: The file '/workspaces/hspc/client/src/registration/create/team.jsx' will need to be 
deleted after this page is completed because it is an older file that serves the same function.
*/
import React, { Component } from "react";
import StatusMessages from "../../_common/components/status-messages/status-messages.jsx";
import UserService from "../../_common/services/user.js";
import Button from "react-bootstrap/Button";
import { connect } from "react-redux";
import DataTable from "react-data-table-component";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice";

class ManageTeam extends Component {
    constructor(props) {
        super(props);
        this.props.dispatchResetErrors();
        this.advisor =
            props.advisor !== undefined ? this.props.advisor.email : undefined;
        this.state = {
            teamName: "",
            schoolId: null,
            competitionId: null,
            questionLevelId: 1,
            advisorId: null,
            isVerified: false,
            studentList: [],
            columns: this.getColumns(),
            // selectedRows: [],
            // setSelectedRows: []
        }
    }

    /*
    TODO: The 'UserService.getAllStudents' needs to be edited so it 
    returns the students that are asscoiated with the advisor's school.
    */
    componentDidMount = () => {
        UserService.getAllStudents()
        .then((response) => {
            if(response.ok){
                this.setState({ studentList: response.data });
            } else console.log("An error has occured. Please try again");
        })
        .catch((resErr) => console.log("Something went wrong. Please try again."))
    }

    getColumns(){
        return [ 
            {
                name: "Student ID",
                selector: row => row.studentid,
                sortable: true,
            },
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
                selector: row => row.schoolid,
                sortable: true,
            },
            {
                name: "Email",
                selector: row => row.email,
                sortable: true,
            },
            {
                name: "GradDate",
                selector: row => row.graddate,
                sortable: true,
            }
        ]
    }

    /* 
    TODO: 
        - Create event handler 'handleRegisterTeam()' for the "Register Team" button.
        - Create event handler 'handleChange' for selected students in datatable to be placed in an array.
    */
    // handleRegisterTeam(){
    //     TeamService.registerTeam(teamName, schoolId, competitionId, questionLevelId, advisorId);
    // }

    // handleChange = ({ selectedRows }) => {
    //     selectedRows = setSelectedRows;
    // }

    render(){
        return(
            <div>
                <StatusMessages/>
                <h2>Students</h2>
                <text>Select the students you want to be a part of this team.</text>
                <section>
                    <DataTable
                        data={this.state.studentList} 
                        columns={this.state.columns}
                        selectableRows
                        // onSelectedRowsChange={handleChange}
                        pagination 
                        paginationPerPage={20} 
                        paginationRowsPerPageOptions={[20, 30, 40, 50]}
                    />
                </section>
                <section>
                    <label htmlFor="formTeamName">Team Name:</label>
                    <input
                        type="text"
                        className="newTeamName"
                        id="formTeamName"
                    />
                </section>
                <section>
                    {/* onClick={() => handleRegisterTeam()} */}
                    <Button type="register">Register Team</Button>
                </section>
            </div>
        )
    }
};

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
  
  export default connect(mapStateToProps, mapDispatchToProps)(ManageTeam);