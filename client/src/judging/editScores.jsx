/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React, { useState, useEffect } from "react";
import Collapsible from "react-collapsible";
import axios from "axios";
import { connect } from "react-redux";

import { Badge, Table, Button, ButtonToolbar, Card } from "react-bootstrap";

/*
 * @author: Steven Blair
 */
function Testcase(props) {
  const [judgeStatus, setJudgeStatus] = useState(null);
  const [dummyInt, setDummyInt] = useState(0);

  const reqBody = {
    teamid: props.teamdata.teamid,
    testcaseid: props.testcaseid,
    questionid: props.questionid,
    pass: true,
  };

  async function passTestcase() {
    await axios.put(
      `http://${window.location.host}/api/judging/judgeasync/`,
      reqBody
    );
    setJudgeStatus(true);
  }
  async function failTestcase() {
    reqBody.pass = false;
    await axios.put(
      `http://${window.location.host}/api/judging/judgeasync/`,
      reqBody
    );
    setJudgeStatus(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `http://${window.location.host}/api/judging/viewResult?questionid=${props.questionid}&teamid=${props.teamdata.teamid}&testcaseid=${props.testcaseid}`
      );
      if (result.data === "") {
        setJudgeStatus(null);
      } else {
        setJudgeStatus(result.data.pass);
      }
    };
    fetchData();
  }, [judgeStatus]);

  function getButtonStyle(b) {
    if (judgeStatus === true && b === "p") {
      return "success";
    }
    if (judgeStatus === false && b === "f") {
      return "danger";
    }
    return "default";
  }

  return (
    <>
      <tr>
        <td>{` ${props.description} `}</td>
        <td>{` ${props.round} `} </td>
        <td>
          <ButtonToolbar>
            <Button
              onClick={async () => {
                await passTestcase();
              }}
              bsSize="sm"
              bsStyle={getButtonStyle("p")}
            >
              Pass
            </Button>
            <Button
              onClick={async () => {
                await failTestcase();
              }}
              bsSize="sm"
              bsStyle={getButtonStyle("f")}
            >
              Fail
            </Button>
          </ButtonToolbar>
        </td>
      </tr>
    </>
  );
}

function Testcases(props) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const testcases = await axios(
        `http://${window.location.host}/api/testcases/viewid?questionid=${props.questionid}`
      );
      setData(testcases.data);
    };
    fetchData();
  }, []);

  // load all the <Testcase>'s
  // if the data isn't available yet ( bc it's async)
  // render nothing
  const tests =
    data != null
      ? data.map((t) => (
          <Testcase key={t.testcaseid} {...t} teamdata={props.teamdata} />
        ))
      : null;

  return <>{tests}</>;
}

function Question(props) {
  const badgeStyle = { marginLeft: "10px", marginBottom: "3px" };

  if (props.questionid === undefined) {
    return null;
  }
  return (
    <>
      <h4>
        Question: {props.index + 1}
        {props.questionlevelid === 1 ? (
          <Badge style={badgeStyle}>Beginner</Badge>
        ) : (
          <Badge style={badgeStyle}>Advanced</Badge>
        )}
      </h4>
      <div style={{ marginBottom: "10px" }}>
        <b>Description:</b> {props.questiondescription}
      </div>
      <Table
        striped
        bordered
        hover
        condensed
        style={{ width: "auto", marginLeft: "auto", marginRight: "auto" }}
      >
        <thead>
          <tr>
            <th>Testcase</th>
            <th>Round #</th>
            <th>Judging</th>
          </tr>
        </thead>
        <tbody>
          <Testcases questionid={props.questionid} teamdata={props.teamdata} />
        </tbody>
      </Table>
      <hr />
    </>
  );
}

function Questions(props) {
  const questions = props.questions.map(function (q, i) {
    if (q.questionlevelid != props.teamdata.questionlevelid) {
      return;
    }
    return (
      // spread operator ... : sends each object in q as prop to Question
      <Question key={q.questionid} index={i} {...q} {...props} />
    );
  });
  return questions;
}

function JudgeTeam(props) {
  const [data, setData] = useState(null);

  // map Question for each question
  useEffect(() => {
    const fetchData = async () => {
      const questions = await axios(
        `http://${window.location.host}/api/questions/view`
      );
      setData(questions.data);
    };
    fetchData();
  }, []);
  if (data === null) {
    return <></>;
  }
  return (
    <Card style={{ width: "80%", marginLeft: "auto", marginRight: "auto" }}>
      <Card.Heading>
        <h4>{"Team: " + props.teamdata.teamname}</h4>
      </Card.Heading>
      <Card.Body>
        <Collapsible
          transitionTime={100}
          trigger={
            <Button style={{ marginBottom: "5px" }}>Show/hide results</Button>
          }
        >
          <Questions questions={data} teamdata={props.teamdata} />
        </Collapsible>
      </Card.Body>
    </Card>
  );
}

/* Main component
 * prop: the current judge */
function EditScores(props) {
  const [assignedTeams, setAssignedTeams] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const teams = await axios(
        `http://${window.location.host}/api/judging/assignedTeams?email=${props.currentUser.email}`
      );
      setAssignedTeams(teams.data);
    };
    fetchData();
  }, []);

  if (assignedTeams === null) {
    // return empty div if data hasn't arrived yet
    return <></>;
  }
  const teams = assignedTeams.map((t) => (
    <JudgeTeam key={t.teamid} teamdata={{ ...t }} />
  ));
  return (
    <div>
      <h3>Hello, these teams are assigned to you.</h3>
      {teams}
    </div>
  );
}

const mapStateToProps = (state) => {
  return { currentUser: state.auth.user };
};

export default connect(mapStateToProps)(EditScores);
