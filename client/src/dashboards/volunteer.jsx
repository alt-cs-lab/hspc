/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { useState } from "react";
import { Navbar, NavItem, Nav, NavDropdown } from "react-bootstrap";
import StatusMessages from "../_common/components/status-messages.jsx";
import DashboardHome from "../home/dashboard-home"
import ViewEvents from "../registration/view/events";
import VolunteerSignUp from "../registration/create/volunteer-sign-up"
//import Questions from "../judging/volunteerAssignmentQuestion";
//import StartJudging from "../judging/startJudging";

//import Scoreboard from "../scoring/scoreboard.jsx";
import "../_common/assets/css/register-user.css";
import "../_common/assets/css/dashboard-volunteer.css";
import { connect } from "react-redux";
import { clearErrors } from "../_store/slices/errorSlice.js";

// const handleCurrentTeam = () => {
//   UserService.getAllUsers()
//     .then((response) => {
//       let body = JSON.parse(response.body);
//       if (response.statusCode === 200) {
//         let user = [];
//         for (let i = 0; i < body.length; i++) {
//           console.log(this.props.currentUser.email);
//           if (body[i].email === this.props.currentUser.email) {
//             user = {  
//               userID: body[i].userid,
//             };
//           }
//         }
//         this.currentUserId = user;

//         this.handleShowStartJudging();
//       }
//     })
//     .catch((resErr) => {
//       console.log("Something went wrong. Please try again");
//     });
// };

function VolunteerDash(props)
{
  const [currentView, setCurrentView] = useState(<DashboardHome user={props.currentUser} />);
  
  return (
    <div>
      <Navbar inverse collapseOnSelect>
          <Navbar.Brand onClick={() => setCurrentView(<DashboardHome user={props.currentUser} />)}>
            Volunteer Portal
          </Navbar.Brand>
          <Navbar.Toggle />
        
        <Navbar.Collapse>
          <Nav>
            <NavDropdown title="Events" id="basic-nav-dropdown">
              <NavItem eventKey={1} onClick={() => setCurrentView(<ViewEvents />)}>
                View Upcoming Events
              </NavItem>
              <NavItem eventKey={2} onClick={() => setCurrentView(<VolunteerSignUp />)}>
                Sign Up To Volunteer
              </NavItem>
            </NavDropdown>
            {/* <NavItem eventKey={4} onClick={() => setCurrentView(<Scoreboard />)}>
              View Board
            </NavItem> */}
            {/* <NavItem eventKey={5} onClick={handleCurrentTeam()}>
              View Assigned Team
            </NavItem> */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="page-body">
        <StatusMessages />
        {currentView}
      </div>
    </div>
  );
}

//Maps the states to props to be used in connect wrapper in export
const mapStateToProps = (state) => {
  console.log("State ", state);
  return { currentUser: state.auth.user };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchResetErrors: () => dispatch(clearErrors()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VolunteerDash);
