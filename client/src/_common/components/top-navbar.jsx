import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../assets/css/public-navbar.css";
import hspcLogo from '../assets/img/hspc-logo.png';
import Image from 'react-bootstrap/Image';

import { selectDashboardRoute } from "../../_store/slices/routeSlice";
import { logout, selectAuth } from "../../_store/slices/authSlice";

export default function TopNavbar(props) {
	const auth = useSelector(selectAuth);
	const dashboardPath = useSelector(selectDashboardRoute);
	const dispatch = useDispatch();

	const onLogoutClick = (e) => {
		dispatch(logout());
	};

	let authButton;
	if (!auth.isAuthenticated) {
		authButton = (
			<Nav.Link as={Link} eventKey={4} href="/" to="/login">
				Sign In
			</Nav.Link>
		);
	} else {
		authButton = (
			<Nav.Link as={Link} eventKey={4} href="/" to="/" onClick={onLogoutClick} type="button">
				Logout
			</Nav.Link>
		);
	}

	return (
		<Navbar expand='lg' collapseOnSelect default >
			<div class="m-3" style={{width: "3%"}}>
			    <Image src={hspcLogo} fluid/>				
			</div>
			<div style={{"font-size": "200%", "margin-bottom": "6px"}}>
				|
			</div>
			<Navbar.Brand>
				<Nav.Link as={Link} href='/' to="/">High School Programming Competition</Nav.Link>
			</Navbar.Brand>
          	<Navbar.Toggle />
			<Navbar.Collapse>
				<Nav>
					{/* <Nav.Link as={Link} eventKey={1} href="/" to="/">
						Home
					</Nav.Link> */}
					<Nav.Link as={Link} eventKey={2} href="/" to="/Competitions" >
						Event
					</Nav.Link>
					<Nav.Link as={Link} eventKey={3} href="/" to={dashboardPath}>
						Dashboard
					</Nav.Link>
					{authButton}
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
}
