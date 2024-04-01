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
import "../_common/assets/css/public-dashboard.css";
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
          <Nav>
            <Nav.Link onClick={() => setCurrentView(<DashboardHome user={props.currentUser} />)}>
              Volunteer Portal
            </Nav.Link>
          </Nav>
          <Navbar.Toggle />
        
        <Navbar.Collapse>
          <Nav>
            <NavDropdown title="Events" align="end" flip>
              <NavDropdown.Item onClick={() => setCurrentView(<ViewEvents />)}>
                View Events
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setCurrentView(<VolunteerSignUp />)}>
                Sign Up To Volunteer
              </NavDropdown.Item>
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
