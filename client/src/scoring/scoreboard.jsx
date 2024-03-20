/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React, { Component } from "react";
import { Table } from "react-bootstrap";
import Select from "react-select";
import StatusMessages from "../_common/components/status-messages.jsx";
//import ScoreboardTile from "./scoreboard-tile";
import "../_common/assets/css/scoreboard.css";
import EventService from "../_common/services/event";
//import Websocket from 'react-websocket';
//import ScoreCardService from "../_common/services/scorecard";
import ViewScore from "../_common/services/scoreboard";
//import io from "socket.io-client";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../_store/slices/errorSlice.js";

const styles = require('../_utilities/styleConstants.js');

//const URL = "ws://localhost:3001"; //for mine Natalie Laughlin
var currentView = null;
//var socket = io("http://localhost:8000");

/*
* @author: Daniel Bell
* @edited by: Caleb Logan
* @edited by:Natalie Laughlin

*/
class Scoreboard extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.eventLive = true;
    this.eventDate = "";
    this.currentView = null;
    this.state = {
      questions: [],
      teamtable: [],
      eventList: [],
      teamTable: [],
      scoreTable: [],
      wrongTable: [],
      //questions: [],
      eventName: "",
    };
    this.getcurrentView();
    /*
        this.ws.on('broadcast', (data) => {
            console.log("Recieved:", data);
            this.setState({ data: data });
        });*/
    this.getAllQuestions = this.getAllQuestions.bind(this);
  }

  //  ws = new WebSocket(URL)

  /*
   * Returns a list of all events when the component is rendered.
   * @Natalie Laughlin Needed the date to get the proper data from the score table
   */
  /* Handles the inital socket connection when the scoreboard page loads.*/
  componentDidMount() {
    EventService.getAllEvents(
      this.props.auth.user.id,
      this.props.auth.user.accessLevel
      )
      .then((response) => {
        if (response.statusCode === 200) {
          let body = JSON.parse(response.body);
          let events = [];
          for (let i = 0; i < body.length; i++) {
            events.push({
              label: body[i].eventdate,
              value: body[i].eventdate,
            });
          }
          this.setState({ eventList: events });
          this.currentView = null;
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));


    this.generateBoard();

    this.ws.onopen = () => {
      console.log("scoreboard", {});

      this.generateBoard();
    };

    /* Handles the socket connection when prop data changes.*/

    this.ws.onmessage = (evt) => {
      this.generateBoard();
    };
  }

  updateScoreBoard(date) {
    ViewScore.getQuesitons(date)
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ questions: response.body }, () => {});
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log(resErr));

    ViewScore.getAllScoreBoard(date)
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ teamTable: response.body }, () => {
            this.generateBoard(); // helper function
          });
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log(resErr));
  }
  /**
   * get the number of questions from the table header
   * @ Natalie Laughlin
   */
  getAllQuestions() {
    return this.state.questions.map((questionid) => {
      return <th>{questionid.questionid}</th>;
    });
  }

  /**
   * creates the questions boxes that will later be colored when answered.  giving an id based on team name and question number
   * @param {the team name whoes questions are being set} teamName
   * @ Natalie Laughlin
   */
  getAllQuestionsset(teamName) {
    return this.state.questions.map((questionid) => {
      return (
        <th
          style={{ backgroundColor: "#E5E5E5" }}
          id={teamName + questionid.questionid}
        >
          {questionid.problemsolved}
        </th>
      );
    });
  }
  /**
   * Gets a teams score for the score table based on their name
   * @param {the team whoes score is being generated} teamname
   * @ Natalie Laughlin
   */
  getAllScoresForTeam(teamname) {
    ViewScore.getteamwrong(teamname)
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ wrongTable: response.body }, () => {});
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log(resErr));
    ViewScore.getteamscore(teamname)
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ scoreTable: response.body }, () => {
            return this.results(teamname);
          });
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log(resErr));
  }
  /**
   * Gets the temas wrong and right answer assining the box a color and symbol
   * @param {the teams score that is being looked up} teamname
   * @ Natalie Laughlin
   */
  results(teamname) {
    this.state.wrongTable.forEach((team) => {
      var point = document.getElementById(teamname + team.questionid);
      point.style.backgroundColor = "#FFC0B4";
      point.textContent = "X"; //accessible for those that are color blind
    });
    this.state.scoreTable.forEach((team) => {
      var point = document.getElementById(teamname + team.questionid);
      point.style.backgroundColor = "#C4FFB4";
      point.textContent = "O"; //accessible for those that are color blind
    });
  }

  /**
   * Generated the Event Name Based on the scoreboard infrontaion then hides the event selector
   * @ Natalie Laughlin
   */
  generateName() {
    if (this.state.teamTable.length > 1) {
      this.setState({ eventName: this.state.teamTable[0].eventname });
      var title = document.getElementById("name");
      title.value = this.state.eventName;
      title.style.fontSize = "xxx-large";
      document.getElementById("lookup").hidden = true;
    }
  }

  /*
   * Generates an array of scoreboard tiles based of this.state.data values.
   */
  generateBoard() {
    const teamScores = [];
    this.state.teamTable.forEach((team, index) => {
      teamScores.push(
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{team.teamname}</td>
          <td>{team.schoolname}</td>
          <td>{team.problemsolved}</td>
          <td>{team.totaltime}</td>
          {this.getAllQuestionsset(team.teamname)}
          {this.generateName()}
          {this.getAllScoresForTeam(team.teamname)}
        </tr>
      );
    });

    currentView = (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team</th>
            <th>School</th>
            <th>Solved</th>
            <th>Total Time</th>
            {this.getAllQuestions()}
          </tr>
        </thead>
        <tbody>{teamScores}</tbody>
      </Table>
    );
    this.forceUpdate();
  }
  /**
   * set the curent view so that when first coming to the page it displays an empty scorebooard.
   * In the past it would hold over the last scoreboard displayed without the updated questions
   * This forces the user to select an event data to generate the score.  Now there could be a way to display
   * a scoreboard that corisponds to the curentdate.  However it did not want to implement that as events are often late.
   * @ Natalie Laughlin
   */
  getcurrentView() {
    currentView = (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team</th>
            <th>School</th>
            <th>Solved</th>
            <th>Total Time</th>
            <th>Questions</th>
          </tr>
        </thead>
      </Table>
    );
    this.forceUpdate();
  }

  /*
   * Renders the UI component.
   * @ Natalie Laughlin added the dropdown to select an event date.
   */
  render() {
    return (
      <div>
        <br />
        <div id="name">{this.state.eventName}</div>

        <div id="lookup">
          <div>
            <p>
              <b>Select Event Date</b>
            </p>
            <Select
              id="dropdown"
              style={styles.selectStyles}
              placeholder="Select an Event Date"
              options={this.state.eventList}
              onChange={(e) => this.updateScoreBoard(e.label)}
            />
            <br />
          </div>
        </div>
        <br />
        <StatusMessages />
        {currentView}
      </div>
    );
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Scoreboard);
