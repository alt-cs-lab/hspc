import React, { useState } from "react";
import { Navbar, Nav, Container, NavLink } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import StatusMessages from "../_common/components/status-messages/status-messages";
import "../_common/assets/css/public-competitions.css";

import beginner2018 from "../_common/assets/beginner2018.pdf";
import advanced2018 from "../_common/assets/advanced2018.pdf";
import beginnerScore2018 from "../_common/assets/beginnerScore2018.pdf";
import advancedScore2018 from "../_common/assets/advancedScore2018.pdf";


/**
 * TODO: NavItems for registration, generaterules, and transport
 * @param {*} props 
 * @returns 
 */
export default function Event(props){

	const [file, setFile] = useState();
	const [currentView, setCurrentView] = useState(generateCreateProblems(setFile));
	
	return (
		<div>
			<Navbar expand='lg'>
				<Container>
					<Navbar.Brand>Competitions</Navbar.Brand>
					<Navbar.Toggle bg='light' aria-controls='basic-navbar-nav'/>
					<Navbar.Collapse id='basic-navbar-nav'>
						<Nav>
							<NavLink onClick={() => {setFile(null);setCurrentView(generateCreateProblems(setFile))}}>
								Problems and Solutions
							</NavLink>
							<NavLink onClick={() => {setFile(null);setCurrentView(generateScoreCards(setFile))}}>
								Scorecards
							</NavLink>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
			
			<div className="event-body">
				<StatusMessages />
				{currentView}
				{file}
			</div>
		</div>
	);
}

function generateCreateProblems(setFile){
	
	return (
		<div>
			<h2>Problems and Solutions</h2>
			<div className='InlineButtons'>
				<Button
					className="Problems"
					onClick={() => setFile(handleOpenFile(beginner2018))}
				>
					Beginning Problems and Solutions 2018
				</Button>
				<Button
					className="Problems"
					onClick={() => setFile(handleOpenFile(advanced2018))}
				>
					Advanced Problems and Solutions 2018
				</Button>
			</div>
		</div>
	);
}

function generateScoreCards(setFile){

	return (
		<div>
			<h2>Scorecards</h2>
			<div className="InlineButtons">
				<Button
					className="Scorecards"
					label="Fall 2018 Competition Scorecard - Beginning Teams"
					onClick={() => setFile(handleOpenFile(beginnerScore2018))}
				>
					Fall 2018 Competition Scorecard - Beginning Teams
				</Button>
				<Button
					className="Scorecards"
					label="Fall 2018 Competition Scorecard - Advanced Teams"
					onClick={() => setFile(handleOpenFile(advancedScore2018))}
				>
					Fall 2018 Competition Scorecard - Advanced Teams
				</Button>
			</div>
		</div>
	)
}

function handleOpenFile(File) {
	console.log(File);
	return (
		<object className="pdf" data={File} type="application/pdf">
			<embed src={File} type="application/pdf" />
		</object>
	)
}
