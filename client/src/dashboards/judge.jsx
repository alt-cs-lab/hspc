/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import StatusMessages from "../_common/components/status-messages.jsx";
import DashboardHome from "../home/dashboard-home"
import ViewEvents from "../registration/view/events";
import VolunteerSignUp from "../registration/create/volunteer-sign-up"
import "../_common/assets/css/public-dashboard.css";
import { connect } from "react-redux";
import { clearErrors } from "../_store/slices/errorSlice.js";

function JudgeDash(props)
{
  const [currentView, setCurrentView] = useState(<DashboardHome user={props.currentUser} />);

  useEffect(() =>{
    props.dispatchResetErrors();
  }, [props]);

  return (
    <div>
      <Navbar inverse collapseOnSelect>
          <Nav>
            <Nav.Link onClick={() => setCurrentView(<DashboardHome user={props.currentUser} />)}>
              Judge Portal
            </Nav.Link>
          </Nav>
          <Navbar.Toggle />
        
        <Navbar.Collapse>
          <Nav>
            <NavDropdown title="Events" align="end" flip>
              <NavDropdown.Item onClick={() => setCurrentView(<ViewEvents />)}>
                View Published Events
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setCurrentView(<VolunteerSignUp />)}>
                Sign Up To Volunteer
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

//Maps the states to props to be used in connect wrapper in export
const mapStateToProps = (state) => {
  return { currentUser: state.auth.user };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchResetErrors: () => dispatch(clearErrors()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(JudgeDash);
