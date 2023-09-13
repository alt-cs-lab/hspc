import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "_store/actions/authActions";
import { Navbar, Nav, NavItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../assets/css/public-navbar.css";

import AuthService from "../services/auth";

/*
 * Creates and renders the navbar. This is viewable across all views.
 * @author: Daniel Bell
 */
export class TopNavbar extends Component {
  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;

    let dashboardPath;
    switch (user.accessLevel) {
      case 1:
        dashboardPath = "student/studentdash";
        break;
      case 20:
        dashboardPath = "volunteer/volunteerdash";
        break;
      case 40:
        dashboardPath = "judge/judgedash";
        break;
      case 41:
        //master judge
        dashboardPath = "judge/judgedash";
        break;
      case 60:
        dashboardPath = "advisor/advisordash";
        break;
      case 80:
        dashboardPath = "admin/admindash";
        break;
      case 100:
        dashboardPath = "master/masterdash";
        break;
      default:
        dashboardPath = "login";
        break;
    }

    let authButton;
    if (!this.props.auth.isAuthenticated) {
      authButton = (
        <NavItem eventKey={4} componentClass={Link} href="/" to="/login">
          Sign In
        </NavItem>
      );
    } else {
      authButton = (
        <NavItem
          eventKey={4}
          componentClass={Link}
          href="/"
          to="/"
          onClick={this.onLogoutClick}
        >
          Logout
        </NavItem>
      );
    }
    return (
      <Navbar default collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">High School Programming Competition</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem eventKey={1} componentClass={Link} href="/" to="/">
              Home
            </NavItem>
            <NavItem
              eventKey={2}
              componentClass={Link}
              href="/"
              to="/Event"
            >
              Event
            </NavItem>
            <NavItem
              eventKey={3}
              componentClass={Link}
              href="/"
              to={"/" + dashboardPath}
            >
              Dashboard
            </NavItem>
            {authButton}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

TopNavbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { logoutUser })(TopNavbar);
