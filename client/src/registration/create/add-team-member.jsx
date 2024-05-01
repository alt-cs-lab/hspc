/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
// import StatusMessages from "../../_common/components/status-messages";
import Button from 'react-bootstrap/Button';
import EventService from "../../_common/services/event";
import TeamService from "../../_common/services/team";
import UserService from "../../_common/services/user";
import { withRouter } from "../../_utilities/routerUtils"
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Table } from "react-bootstrap";
// import ReactTable from "react-table";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice";
// // import "react-table/react-table.css";


/*
 * @author: Daniel Bell, Trent Kempker
 */
class AddUser extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
      this.state = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        accessLevel: "1",
        advisorEmail: (this.props.advisor !== undefined) ? this.props.advisor.email: this.props.advisor,
        eventDate: "",
        teamName: this.props.teamName,
        columns: this.getColumns(),
        eventList: [],
        teamList: [],
        studentList: [],
        emailList: [],
        selected: [],
        show: false,
        checkMax: false
      };
    }

  /*
   * Loads the values of registered teams and populates the dropdown.
   */
  componentDidMount = () => {
    TeamService.getAllTeams()
      .then((response) => {
        let body = JSON.parse(response.body);
        let teams = [];
        if (
          response.statusCode === 200 &&
          this.state.advisorEmail === undefined
        ) {
          for (let i = 0; i < body.length; i++) {
            teams.push({
              label: body[i].teamname,
              value: body[i].teamid,
            });
          }
        } else if (response.statusCode === 200) {
          for (let i = 0; i < body.length; i++) {
            if (body[i].email === this.state.advisorEmail) {
              //was not accesting the right data fixed Natalie Laughlin
              teams.push({
                label: body[i].teamname,
                value: body[i].teamid,
              });
            }
          }
        } else {
          console.log("An error has occurred loading teams, Please try again.");
        }
        this.setState({ teamList: teams });
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));

    EventService.getAllEvents(
      this.props.auth.user.id,
      this.props.auth.user.accessLevel
    )
      .then((response) => {
        let body = response.body;
        let events = [];
        if (response.statusCode === 200) {
          for (let i = 0; i < body.length; i++) {
            events.push({
              label: body[i].eventname,
              value: body[i].eventname,
            });
          }
        } else {
          console.log("An error occured, Please try again.");
        }
        this.setState({ eventList: events });
      })
      .catch((resErr) => console.log("Something went wrong loading events. Please try again"));

    if (this.state.advisorEmail === undefined) {
      //checks if advisor is signed in Natalie Laughlin
      UserService.getAllStudents()
        .then((response) => {
          if (response.statusCode === 200 || response.statusCode === 201) {
            this.setState({ studentList: JSON.parse(response.body) }, () => {});
          } else console.log("An error has occurred, Please try again.");
          let select = [];
          // populates the selected array with false values
          /*for (let i = 0; i < this.state.studentList.length; i++){
            console.log(i);
            this.select.push(false);
          }*/
          this.setState({selected: select});
        })
        .catch((resErr) =>
          console.log("Something went wrong loading students. Please try again")
        );
    } else {
      //gets the users based on the adviso modled off the method above added by Natalie Laughlin
      UserService.getStudentsFromAdvisors(this.state.advisorEmail)
        .then((response) => {
          if (response.statusCode === 200) {
            this.setState({ studentList: response.body });
          } else console.log("An error has occurred, Please try again.");

          let select = [];
          // populates the selected array with false values
          /*for (let i = 0; i < this.state.studentList.length; i++)
            this.select.push(false);*/
          this.setState({selected: select});
        })
        .catch((resErr) =>
          console.log("Something went wrong. Please try again")
        );
    }
  };

  refreshPage() {
    window.location.reload(false);
  }

  /*
   * Handles adding the selected students to the selected team
   *
   * Now it loops through all the students selected and Adds them to the team Natalie Laughlin
   */
  handleAddToTeam() {
    this.props.dispatchResetErrors();
    var i;
    if(this.state.teamName === "" || this.state.emailList.length <= 0){
      this.props.dispatchError("Please select both a team and user to add.");
    }
    else{
    for (i = 0; i < this.state.emailList.length; i++) {
      UserService.getstudentsteam(this.state.teamName)
      .then((response) => {
        if(response.body.length < 4){
            TeamService.addStudentToTeam(this.state.emailList[i-1], this.state.teamName)
            .then((response) => {
              if(response.statusCode === 201 || response.statusCode === 200) {
                this.props.dispatchSuccess(
                  "Successfully added user(s) to the team."
                );
                this.componentDidMount();
                this.removeCheck();
                this.refreshPage();
              }
            })
            .catch(() => {
              this.props.dispatchError(
                "There was an issue adding user(s) to the team."
              );
            });
        }
          //CheckMax is false meaning that the max number of students (4) has been reached
          else{
            this.props.dispatchError("Max team limit for " + this.state.teamName + " has been reached");
          }
      })
      .catch(() => {
        this.props.dispatchError(
          "There was an issue adding user(s) to the team."
        );
      });
    }
  }
    //outside the else
    //these setstates are being called before the userservice executes.
    //this.setState({emailList: []});
    //this.setState({checkMax: false});
  }

  /*
   * Binds a student to a specific team. (can reference functionality in add-event-team.jsx)
   *
   *  Add the selected Student to the list of emails Natalie Laughlin
   */
  handleCheckboxClick = (user) => {
    // ---- use the commented code if radio button is changed to checkbox ----
    // let index = team.target.getAttribute('data-index');
    // if (this.selected[index] === false) this.selected[index] = true;
    // else this.selected[index] = false;

    // if(this.selected[index] === true) this.state.email = team.target.getAttribute('email-index');

    //Check to see if the the user checked the box
    if(!user.target.checked){
      user.target.checked = false;
      let simple = this.state.emailList;
      let index = simple.indexOf(user.target.getAttribute("email-index"));
      simple.splice(index, 1);
      this.setState({emailList: simple});
    }
    //If the target is unchecked then add the user to the list
    else{
      this.state.email = user.target.getAttribute("email-index");
    
      let joined = this.state.emailList;
      joined.push(this.state.email); 
      this.setState({emailList: joined});
    }
    console.log(this.state.emailList);
  };
  /**
   * helper to remove all the checked boxes
   * Natalie Laughlin
   */
  removeCheck() {
    var box = document.getElementsByName("addToTeam");
    for (var j = 0; j < box.length; j++) {
      box[j].checked = false;
    }
  }

  /*
   * Updates the list of teams based on selected event
   */
  UpdateTeams(nameofevent) {
    TeamService.getAllTeamsInCompName(nameofevent).then((response) => {
      let teams = [];
      if (response.body.length > 0) {
        let body = response.body;
        if (
          response.statusCode === 200 &&
          this.state.advisorEmail === undefined
        ) {
          for (let i = 0; i < body.length; i++) {
            teams.push({
              label: body[i].teamname,
              value: body[i].teamname,
            });
          }
        } else if (response.statusCode === 200) {
          for (let i = 0; i < body.length; i++) {
            if (body[i].email === this.state.advisorEmail) {
              //was not accesting the right data fixed Natalie Laughlin
              teams.push({
                label: body[i].teamname,
                value: body[i].teamname,
              });
            }
          }
        } else {
          this.props.dispatchError(
            `There was an error filtering students by "${nameofevent}" event`
          );
        }
      }
      this.setState({ teamList: teams });
    });
  }

  getColumns() {
    return [
      {
        Header: "Phone",
        accessor: "phone",
        Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
      },
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
        Header: "Level",
        Cell: (cell) => (
          <div style={{ textAlign: "left" }}>
            {cell.original.accesslevel === 1 ? (
              <span>Student</span>
            ) : cell.original.accesslevel === 20 ? (
              <span>Volunteer</span>
            ) : cell.original.accesslevel === 40 ? (
              <span>Judge</span>
            ) : cell.original.accesslevel === 60 ? (
              <span>Advisor</span>
            ) : cell.original.accesslevel === 80 ? (
              <span>Admin</span>
            ) : cell.original.accesslevel === 100 ? (
              <span>Master</span>
            ) : (
              <span> </span>
            )}
          </div>
        ),
      },
      {
        Header: "Add to Team",
        Cell: (cell) => (
          <input
            type="checkbox"
            name="addToTeam"
            onClick={(e) => {this.handleCheckboxClick(e)}}
            defaultChecked={false}
            data-index={cell.row.index}
            email-index={cell.row.email} //swapped to check box Natalie Laughlin
          />
        ),
      },
    ];
  }
  /*
   * Renders the component UI.
   */
  render() {
    return (
      <div name="status-div" className="RegisterBox">
        {/* {this.props.errors.errorMsg !== "" ||
        this.props.errors.successMsg !== "" ? (
          <StatusMessages />
        ) : (
          ""
        )} */}
        <h2>Add a Student</h2>
        <section
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "5px", fontSize: "16px" }}>
              Select Event:
            </span>
            <div id="sub-nav" className="teamDropDown">
              <Select
                id="event-dropdown"
                placeholder="Select Event"
                options={this.state.eventList}
                onChange={(opt) => this.UpdateTeams(opt.label)}
              />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "16px" }}>Select Team Name:</span>
            <div id="sub-nav">
              <Select
                placeholder="Select a Team Name"
                options={this.state.teamList}
                onChange={(opt) => this.setState({ teamName: opt.label })}
              />
            </div>
          </div>
        </section>
        <div>
          <p>
            <b>
              Select which students you would like to add from the available
              students below
            </b>
          </p>
          <Table data={this.state.eventTable} columns={this.state.columns}/>
          <br />
          <Button
            variant="secondary"
            className="RegisterButton"
            onClick={(event) => this.handleAddToTeam()}
          >
            Add to Team
          </Button>
        </div>
      </div>
    );
  }
}

AddUser.propTypes = {
  errors: PropTypes.object.isRequired,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddUser)); // TODO: REMOVE ME? This is deprecated
