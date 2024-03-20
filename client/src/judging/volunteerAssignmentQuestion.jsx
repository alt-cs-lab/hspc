/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React from "react";
import "./volunteerAssignmentQuestion.css";
import { Table } from "react-bootstrap";
import StatusMessages from "../_common/components/status-messages.jsx";
import QuestionService from "../_common/services/questions";
import Result from "./testcaseResult";

var currentView = null;

/*
 * @author:  May Phyo
 * This is the main page for judging portion that will allow volunteer judges to see the questions, test cases for those questions,
 * and declare whether the teams pass or fail
 */

/*
 *  Needs to be finished:
 *        I have hard-coded in the roundID. Implement UI for roundID in assingVolunteerBoard.jsx, then use it here
 *        Find a way to keep track of number of attempt for team on the problem. Only allow judge to select next testcase if first 1 passes.
 *        If team passes testcases for that problem, add them to the scoreboard via API interactions to score tabel.
 *
 */
export default class Questions extends React.Component {
  /*
   * Renders the UI component.
   */
  constructor(props) {
    super(props);

    this.state = {
      currentTeam: this.props.location.state,
    };
  }

  /*
   * Returns a list of all registered questions when the component is rendered.
   *
   */
  componentDidMount = () => {
    QuestionService.getAllquestions()
      .then((response) => {
        var data = JSON.parse(response.body);
        if (response.statusCode === 200) {
          // get the new list of users by removing the user that is getting moved to volunteers

          this.setState({ questionTable: data }, () => {
            this.setState({ questionTable: this.state.questionTable.filter(
              (q) =>
                q.round === 1 &&
                q.questionlevelid ===
                  this.state.currentTeam.team[0].questionlevelid
            )});
            this.generateQuestionsTable(); // helper function
          });
          // console.log(this.state.questionTable)
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
  };

  /*
   * Helper function for to generate table of questions for each round
   */
  generateQuestionsTable() {
    const questions = [];
    console.log(this.state.questionTable);
    var level = "";
    this.state.questionTable.forEach((question, index) => {
      if (question.questionlevelid === 1) {
        level = "Beginner";
      } else {
        level = "Advanced";
      }
      console.log(question.questionid);
      questions.push(
        <tr
          key={index}
          onClick={(event) =>
            this.getTestCases(question.questionid)
          } /*The user can selct the team that they want to look at */
        >
          <td>{index + 1}</td>
          <td>{question.questionid}</td>
          <td>{question.name}</td>
          <td>{question.questiondescription}</td>
          <td>{level}</td>
          <td>{question.round}</td>
        </tr>
      );
    });
    currentView = (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>

            <th>Level</th>
            <th>Round</th>
          </tr>
        </thead>
        <tbody>{questions}</tbody>
      </Table>
    );
    this.forceUpdate();
  }
  /*
   *Returns a list of all testcases for that question
   *  @author: May Phyo
   */
  getTestCases(qID) {
    //Need to implement for getting test cases

    QuestionService.getTestcasesByID(qID)
      .then((response) => {
        if (response.statusCode === 200) {
          let body = response.body;

          this.setState({ testcaseTable: body }, () => {
            this.generateTestCaseTable(); // helper function
          });
        } else {
          console.log(
            "An error has occurred while getting assignment, Please try again."
          );
        }
      })
      .catch((resErr) => {
        console.log("resErr:", resErr);
      });
  }
  generateTestCaseTable() {
    const testcases = [];
    //console.log(this.state.testcaseTable);
    this.state.testcaseTable.forEach((testcase, index) => {
      testcases.push(
        <tr key={index} onClick={(event) => this.declarePassorFail()}>
          <td>{index + 1}</td>
          <td>{testcase.testcaseid}</td>
          <td>{testcase.description}</td>
          <td>{testcase.round}</td>
        </tr>
      );
    });
    currentView = (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>TestCase ID</th>
            <th>Description</th>
            <th>Round</th>
          </tr>
        </thead>
        <tbody>{testcases}</tbody>
      </Table>
    );
    this.forceUpdate();
  }

  declarePassorFail() {
    currentView = <Result />;
    this.forceUpdate();
  }

  //Shows problems assigned for team based on the round and questionlevelid
  //Shows testcases for those problems based on questionid
  //Let's judge declare whether testcases passed (note: only the UI is functional for this.)
  render() {
    console.log(this.state.currentTeam.team[0].questionlevelid === 1);
    return (
      <div className={"question"}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>{this.state.currentTeam.team[0].teamname}</h2>
        </div>
        <div>
          <StatusMessages />
          {currentView}
        </div>
      </div>
    );
  }
}
