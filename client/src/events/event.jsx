import React, { Component } from "react";
import { Navbar, NavItem, Nav, Jumbotron } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import StatusMessages from "../_common/components/status-messages/status-messages";
import "../_common/assets/css/public-competitions.css";

import beginner2018 from "../_common/assets/beginner2018.pdf";
import advanced2018 from "../_common/assets/advanced2018.pdf";
import beginnerScore2018 from "../_common/assets/beginnerScore2018.pdf";
import advancedScore2018 from "../_common/assets/advancedScore2018.pdf";
var currentView = null;

/*
 * @author: Kyle Fairfax
 */
export default class Event extends Component {
  constructor(props) {
    super(props);
  }

  /*
   * Generates the view for the problems and solutions tab andgenerates buttons for to open the PDFs
   */
  handleCreateProblems = (event) => {
    currentView = (
      <div>
        <Jumbotron>
          <h2>Problems and Solutions</h2>
              <Button
                variant="primary"
                className="Problems"
                style={{
                  backgroundColor: "#350B4F",
                  fontSize: "14px",
                  color: "white",
                  margin: "20px",
                }}
                onClick={(event) => this.handleOpenFile(beginner2018)}
              >
                Beginning Problems and Solutions 2018
              </Button>
              <br />
              <Button
                variant="primary"
                className="Problems"
                style={{
                  backgroundColor: "#350B4F",
                  fontSize: "14px",
                  color: "white",
                  margin: "20px",
                }}
                onClick={(event) => this.handleOpenFile(advanced2018)}
              >
                Advanced Problems and Solutions 2018
              </Button>
        </Jumbotron>
      </div>
    );
    this.forceUpdate();
  };

  /*
   * Opens PDFs in another window from the Docs folder in the public directory
   * Takes two strings to represent the folder and file names as arguments
   * @param the uploaded file
   */
  handleOpenFile = (File) => {
    console.log(File);
    currentView = (
      <object className="pdf" data={File} type="application/pdf">
        <embed src={File} type="application/pdf" />
      </object>
    );
    this.forceUpdate();
  };

  /*
   * Handles the showing of Scorecard pdf files. Files must be imported above to be used.
   */
  handleScorecards = () => {
    currentView = (
      <div>
        <Jumbotron>
          <h2>Scorecards</h2>
              <Button
                variant="primary"
                className="Scorecards"
                label="Fall 2018 Competition Scorecard - Beginning Teams"
                style={{
                  backgroundColor: "#350B4F",
                  fontSize: "14px",
                  color: "white",
                  margin: "20px",
                }}
                onClick={() => this.handleOpenFile(beginnerScore2018)}
              >
                Fall 2018 Competition Scorecard - Beginning Teams
              </Button>
              <br />
              <Button
                variant="primary"
                className="Scorecards"
                label="Fall 2018 Competition Scorecard - Advanced Teams"
                style={{
                  backgroundColor: "#350B4F",
                  fontSize: "14px",
                  color: "white",
                  margin: "20px",
                }}
                onClick={() => this.handleOpenFile(advancedScore2018)}
              >
                Fall 2018 Competition Scorecard - Advanced Teams
              </Button>
        </Jumbotron>
      </div>
    );
    this.forceUpdate();
  };

  /*
   * Resets the tab to it's default view.
   */
  clearAll = () => {
    currentView = null;
    this.forceUpdate();
  };

  /*
   * Renders the component UI.
   */
  render() {
    return (
      <div>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand onClick={this.clearAll}>Competitions</Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} onClick={this.handleCreateProblems}>
                Problems and Solutions
              </NavItem>
              <NavItem eventKey={2} onClick={this.handleScorecards}>
                Scorecards
              </NavItem>
              {/*  <NavItem eventKey={3} onClick={this.handleRegRules}>Registration</NavItem>
                            <NavItem eventKey={4} onClick={this.handleGenerateRules}>Rules</NavItem>
                            <NavItem eventKey={5} onClick={this.handleTransport}>Transportation</NavItem> */}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Jumbotron className="page-body">
          <StatusMessages />
          {currentView}
        </Jumbotron>
      </div>
    );
  }
}
