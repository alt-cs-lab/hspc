/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import {
  Badge,
  Button,
  Table,
  ButtonToolbar,
  Modal,
  FormGroup,
  FormControl,
  FormLabel,
  ToggleButton,
} from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

/*
 * @author: Steven Blair
 */

async function getNewTestcaseId() {}

async function deleteTestcase(id, callback) {
  const body = { testcaseid: id };
  // are you sure prompt?
  const yes = window.confirm("Are you sure?");
  if (!yes) {
    return;
  }
  const deleteCall = await axios.delete(
    `http://${window.location.host}/api/testcases/remove`,
    { data: body }
  );
  callback();
  return deleteCall;
}

function AddQuestionModal(props) {
  const [text, setText] = useState("");
  const [level, setLevel] = useState(1);

  async function submit() {
    await addQuestion();
    props.setShow(false); // update the parent's showModal state var
    // update the parent (not really needed, bc of the above state var)
    props.callback();
  }

  async function addQuestion() {
    const allQuestions = await axios(
      `http://${window.location.host}/api/questions/view`
    );

    const newQuestionId =
      allQuestions.data.length > 0
        ? Math.max.apply(
            Math,
            allQuestions.data.map(function (o) {
              return o.questionid;
            })
          ) + 1
        : 1;
    const newquestion = {
      id: newQuestionId,
      lvl: level,
      description: text,
    };
    const postNewQuestion = await axios.post(
      `http://${window.location.host}/api/questions/add`,
      newquestion
    );
  }

  return (
    <Modal
      show={props.show}
      onHide={() => {
        props.setShow(false);
      }}
    >
      <Modal.Header>
        <Modal.Title> Add Question </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <FormGroup controlId="formBasicText">
            <FormLabel>Description:</FormLabel>
            <FormControl
              componentClass="textArea"
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup>
            <FormLabel>Question level:</FormLabel>
            <ToggleButton
              type="radio"
              name="radioGroup"
              checked={level === 1}
              inline
              onChange={(event) => setLevel(1)}
            >
              Beginner
            </ToggleButton>{" "}
            <ToggleButton
              type="radio"
              name="radioGroup"
              checked={level === 2}
              inline
              onChange={(event) => setLevel(2)}
            >
              Advanced
            </ToggleButton>{" "}
          </FormGroup>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            props.setShow(false);
          }}
          bsStyle="default"
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            await submit();
          }}
          bsStyle="primary"
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function AddTestcaseModal(props) {
  const [text, setText] = useState("");
  const [round, setRound] = useState(1);

  async function submit() {
    await addNewTestcase(props.questionid);
    props.setShow(false);
    props.callback();
  }

  async function addNewTestcase() {
    const testcases = await axios(
      `http://${window.location.host}/api/testcases/view`
    );

    // the first testcase id is 1, the rest are maxid + 1
    const newTestcaseId =
      testcases.data.length > 0
        ? Math.max.apply(
            0,
            testcases.data.map(function (o) {
              return o.testcaseid;
            })
          ) + 1
        : 1;
    const testcaseid = newTestcaseId;
    const questionid = props.questionid;

    const newtestcase = {
      testcaseid: testcaseid,
      questionid: questionid,
      description: text,
      round: round,
    };

    const postNewTestcase = await axios.post(
      `http://${window.location.host}/api/testcases/add`,
      newtestcase
    );
  }

  return (
    <Modal
      show={props.show}
      onHide={() => {
        props.setShow(false);
      }}
    >
      <Modal.Header>
        <Modal.Title> Add Testcase </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <FormGroup controlId="formBasicText">
            <FormLabel>Description:</FormLabel>
            <FormControl
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="formBasicNumber">
            <FormLabel>Round:</FormLabel>
            <FormControl
              type="number"
              value={round}
              placeholder={1}
              onChange={(event) => setRound(event.target.value)}
            />
            <FormControl.Feedback />
          </FormGroup>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            props.setShow(false);
          }}
          bsStyle="default"
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            await submit();
          }}
          bsStyle="primary"
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function Questions(props) {
  const questions = props.questions.map((q, i) => (
    // spread operator ... : sends each object in q as prop to Question
    <Question
      key={q.questionid}
      index={i}
      currentUser={props.currentUser}
      callback={props.callback}
      {...q}
    />
  ));
  return questions;
}

function Question(props) {
  // this dummyInt is used for refreshing just like it is elsewhere,
  // but it's also passed as a prop to <Testcases>
  const [dummyInt, doUpdate] = useState(0);
  const [showModal, setModal] = useState(false);

  function handleUpdate() {
    console.log("update <Question/>");
    doUpdate(dummyInt + 1);
  }

  async function deleteQuestion() {
    const yes = window.confirm(
      `Are you sure? This will delete testcases and judging results for this question.`
    );
    if (!yes) {
      return;
    }
    const body = { questionid: props.questionid };
    const deleteCall = await axios.delete(
      `http://${window.location.host}/api/questions/removeasync`,
      { data: body }
    );

    props.callback(); // update/render <EditQuestions/>
  }

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
            {props.currentUser !== undefined &&
              props.currentUser.accessLevel > 40 && (
                <th>
                  <FontAwesomeIcon Icon={faCog}></FontAwesomeIcon>
                </th>
              )}
          </tr>
        </thead>
        <tbody>
          {props.questionid !== undefined && (
            <Testcases
              currentUser={props.currentUser}
              questionid={props.questionid}
              callback={props.callback}
              dummyProp={dummyInt}
            />
          )}
          {props.currentUser.accessLevel > 40 && (
            <tr>
              <td colSpan="3">
                <Button
                  onClick={async () => {
                    setModal(true);
                  }}
                  bsSize="sm"
                  bsStyle="default"
                >
                  Add Testcase
                </Button>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {props.currentUser.accessLevel > 40 && (
        <Button
          onClick={async () => {
            await deleteQuestion();
          }}
          bsSize="sm"
          bsStyle="link"
        >
          Delete Question
        </Button>
      )}
      <hr />
      <AddTestcaseModal
        show={showModal}
        setShow={setModal}
        questionid={props.questionid}
        callback={handleUpdate}
      />
    </>
  );
}

function Testcases(props) {
  const [data, setData] = useState(null);

  // children of this component will call this callback fn
  // to update the state variable - causing a re-render
  const [dummyInt, doUpdate] = useState(0);
  function handleUpdate() {
    console.log("update <Testcases/>");
    doUpdate(dummyInt + 1);
  }

  // dummyInt is a state variable used for the delete testcase button
  // dummyProp is a prop used for the add new testcase button
  //   -> the reason why has to do with parent/child stuff
  //      definitely better ways to do this...
  useEffect(() => {
    const fetchData = async () => {
      const testcases = await axios(
        `http://${window.location.host}/api/testcases/viewid?questionid=${props.questionid}`
      );
      setData(testcases.data);
    };
    fetchData();
  }, [dummyInt, props.dummyProp]);

  // load all the <Testcase>'s
  // if the data isn't available yet ( bc it's async)
  // render nothing
  const tests =
    data !== null
      ? data.map((t) => (
          <>
            <Testcase
              key={t.testcaseid}
              currentUser={props.currentUser}
              callback={handleUpdate}
              {...t}
            />
          </>
        ))
      : null;

  return <>{tests}</>;
}

function EditTestcaseModal(props) {
  const [text, setText] = useState(props.text);
  const [round, setRound] = useState(1);

  async function submit() {
    console.log("update testcase");
    // call api endpoint to update testcase
    const editTestcase = {
      testcaseid: props.testcaseid,
      questionid: props.questionid,
      round: round,
      description: text,
    };
    const postEditTestcase = await axios.post(
      `http://${window.location.host}/api/testcases/edit`,
      editTestcase
    );
    props.setShow(false);
    props.callback();
  }

  return (
    <>
      <Modal
        show={props.show}
        onHide={() => {
          props.setShow(false);
        }}
      >
        <Modal.Header>
          <Modal.Title> Edit Testcase </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <FormGroup controlId="formBasicText">
              <FormLabel>Description:</FormLabel>
              <FormControl
                componentClass="textarea"
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup controlId="formBasicNumber">
              <FormLabel>Round:</FormLabel>
              <FormControl
                type="number"
                value={round}
                placeholder={1}
                onChange={(event) => setRound(event.target.value)}
              />
              <FormControl.Feedback />
            </FormGroup>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              props.setShow(false);
            }}
            bsStyle="default"
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await submit();
            }}
            bsStyle="primary"
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function Testcase(props) {
  const [showModal, setModal] = useState(false);
  return (
    <>
      <EditTestcaseModal
        show={showModal}
        setShow={setModal}
        text={props.description}
        round={props.round}
        callback={props.callback}
        testcaseid={props.testcaseid}
        questionid={props.questionid}
      />
      <tr>
        <td>{` ${props.description} `}</td>
        <td>{` ${props.round} `} </td>
        {props.currentUser.accessLevel > 40 && (
          <td>
            <ButtonToolbar>
              <Button
                bsSize="sm"
                bsStyle="primary"
                onClick={async () => setModal(true)}
              >
                Edit
              </Button>
              <Button
                onClick={async () => {
                  await deleteTestcase(props.testcaseid, props.callback);
                }}
                bsSize="sm"
                bsStyle="danger"
              >
                Delete
              </Button>
            </ButtonToolbar>
          </td>
        )}
      </tr>
    </>
  );
}

/* Main question component
 *  */
function EditQuestions(props) {
  // create a state variable for the questions
  // initially empty, useEffect will set this data and  cause rerender
  const [data, setData] = useState();

  const [showModal, setModal] = useState(false);

  // children of this component will call this callback fn
  // to update the state variable - causing a re-render
  const [dummyInt, doUpdate] = useState(0);
  function handleUpdate() {
    doUpdate(dummyInt + 1);
  }

  // useEffect( fn, [x1,x2...] runs when component mounts
  // where changes to x1..xn cause fn to re-run
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(
        `http://${window.location.host}/api/questions/view`
      );
      setData(response.data);
    };
    fetchData();
  }, [dummyInt]);

  console.log("Render again");
  console.log("Data: ", data);
  return (
    <div>
      {data && data.length > 0 ? (
        <Questions
          questions={data}
          currentUser={props.currentUser}
          callback={handleUpdate}
        />
      ) : (
        <h3>There are currently no questions.</h3>
      )}

      {props.currentUser.accessLevel > 40 && (
        <>
          <Button
            onClick={() => {
              setModal(true);
            }}
            bsStyle="primary"
          >
            Add Question
          </Button>

          <AddQuestionModal
            show={showModal}
            setShow={setModal}
            callback={handleUpdate}
          />
          <hr />
        </>
      )}
    </div>
  );
}
const mapStateToProps = (state) => {
  return { currentUser: state.auth.user };
};

export default connect(mapStateToProps)(EditQuestions);
