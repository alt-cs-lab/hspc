/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, { Component } from "react";
import { Table } from "react-bootstrap";
import StatusMessages from "../../_common/components/status-messages/status-messages.jsx";
import QuestionService from "../../_common/services/questions";
import "../../_common/assets/css/ReactTableCSS.css";

var currentView = null;

/*
 * @author: Natalie Laughlin - formate taken from other classes authored by Tyler Trammell
 * Class that handles the client side viewing of all questions. UI of View Questions
 */
export default class ViewSchools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schoolTable: [],
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
          this.setState({ questionTable: data }, () => {
            this.generateSchoolTable(); // helper function
          });
        } else console.log("An error has occurred, Please try again.");
      })
      .catch((resErr) => console.log("Something went wrong. Please try again"));
  };

  /*
   * Helper function for handleShowquestions. Generates the data as a table.
   */
  //trying to get this to fill the table
  generateSchoolTable() {
    const questions = [];
    var level = "";
    this.state.questionTable.forEach((question, index) => {
      if (question.questionlevelid == 1) {
        level = "Beginner";
      } else {
        level = "Advanced";
      }
      questions.push(
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{question.questionid}</td>
          <td>{question.questiondescription}</td>
          <td>{level}</td>
        </tr>
      );
    });
    currentView = (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Description</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>{questions}</tbody>
      </Table>
    );
    this.forceUpdate();
  }

  /*
   *
   * Renders all the registered questions in table form
   *
   */
  render() {
    return (
      <div>
        <StatusMessages />
        {currentView}
      </div>
    );
  }
}
