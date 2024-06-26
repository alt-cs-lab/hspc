/**
 * Dashboard for Master Judges
 * Author:
 * Modified: 5/1/2024
 */
import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { connect } from "react-redux";
import StatusMessages from "../_common/components/status-messages.jsx";
import DashboardHome from "../home/dashboard-home";
import CreateEvent from "../registration/create/event";
import ViewEvents from "../registration/view/events";
import ViewEventsUnpublished from "../registration/view/events-unpublished.jsx";
import ViewUsers from "../registration/view/users";
import TeamRequests from "../registration/view/team-requests";
import SchoolRequests from "../registration/view/advisor-school-requests";
import ViewTeams from "../registration/view/all-teams";
import Register from "../registration/create/user";
import CreateTeam from "../registration/create/team";
import "../_common/assets/css/public-dashboard.css";
import RegisterSchool from "../registration/create/school";
import ViewSchools from "../registration/view/schools.jsx";
import ViewAllStudents from "../registration/view/all-high-school-students.jsx";
import { clearErrors } from "../_store/slices/errorSlice.js";

/**
 * Returns a react component that renders the Master Judge dashboard
 */
function MasterDash(props) {
  const [currentView, setCurrentView] = useState(
    <DashboardHome user={props.currentUser} />
  );

  useEffect(() => {
    props.dispatchResetErrors();
  }, [props]);

  return (
    <div>
      <Navbar>
        <Nav>
          <Nav.Link
            onClick={() =>
              setCurrentView(<DashboardHome user={props.currentUser} />)
            }
          >
            Master Portal
          </Nav.Link>
        </Nav>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav>
            <NavDropdown title="Requests">
              <NavDropdown.Item
                onClick={() => setCurrentView(<TeamRequests />)}
              >
                Team Requests
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => setCurrentView(<SchoolRequests />)}
              >
                School Requests
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Users">
              <NavDropdown.Item onClick={() => setCurrentView(<Register />)}>
                Create User
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setCurrentView(<ViewUsers />)}>
                View Users
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Schools">
              <NavDropdown.Item
                onClick={() => setCurrentView(<RegisterSchool />)}
              >
                Create School
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setCurrentView(<ViewSchools />)}>
                View Schools
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Students">
              <NavDropdown.Item
                onClick={() =>
                  setCurrentView(
                    <ViewAllStudents setCurrentView={setCurrentView} />
                  )
                }
              >
                View Students
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Teams">
              <NavDropdown.Item
                onClick={() =>
                  setCurrentView(<CreateTeam advisor={props.currentUser} />)
                }
              >
                Create Team
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setCurrentView(<ViewTeams />)}>
                View Teams
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Events" align="end" flip>
              <NavDropdown.Item onClick={() => setCurrentView(<CreateEvent />)}>
                Create Event
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setCurrentView(<ViewEvents />)}>
                View Published Events
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => setCurrentView(<ViewEventsUnpublished />)}
              >
                View Unpublished Events
              </NavDropdown.Item>
            </NavDropdown>
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

/**
 * Redux initializes props.
 */
const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.user,
  };
};

/**
 * Redux updates props.
 */
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchResetErrors: () => dispatch(clearErrors()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MasterDash);
