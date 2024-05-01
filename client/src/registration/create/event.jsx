/**
 * Create event page
 * Author:
 * Modified: 5/1/2024
 */
import React, { Component } from "react";
//import ReCAPTCHA from "react-recaptcha";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import EventService from "../../_common/services/event.js";
import { connect } from "react-redux";
import {
  clearErrors,
  updateErrorMsg,
  updateSuccessMsg,
} from "../../_store/slices/errorSlice";

/*
 * @author: Daniel Bell, Trent Kempker
 * Updated: Natalie Laughlin - added eventName
 */
class CreateEvent extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    //this.recaptchaLoaded = this.recaptchaLoaded.bind(this);
    //this.verifyCallback = this.verifyCallback.bind(this);
    this.state = {
      eventName: "",
      eventLocation: "",
      eventDate: "",
      eventStartTime: "",
      eventEndTime: "",
      teamsPerEvent: "",
      beginnerTeamsPerEvent: "",
      advancedTeamsPerEvent: "",
      teamsPerSchool: "",
      beginnerTeamsPerSchool: "",
      advancedTeamsPerSchool: "",
      description: "",
      //isVerified: false,
    };
  }

  /*
   * Creates a new event and adds the corresponding information to the database.
   */
  handleRegisterEvent(event) {
    //if (this.state.isVerified) {
    EventService.createEvent(
      this.state.eventName,
      this.state.eventLocation,
      this.state.eventDate,
      this.state.eventStartTime,
      this.state.eventEndTime,
      this.state.teamsPerEvent,
      this.state.beginnerTeamsPerEvent,
      this.state.advancedTeamsPerEvent,
      this.state.teamsPerSchool,
      this.state.beginnerTeamsPerSchool,
      this.state.advancedTeamsPerSchool,
      this.state.description
    )
      .then((response) => {
        if (response.status === 201) {
          this.props.dispatchSuccess("Event Created!");
        } else {
          this.props.dispatchError("Error Creating Event.");
        }
      })
      .catch((error) => {
        this.props.dispatchError("Error Querying Server");
      });
    // } else {
    //     this.props.dispatchError("Please verify you are a human.");
    // }
  }

  /*
   * Indicates successful loading of the captcha for debugging purposes
   */
  // recaptchaLoaded() {
  //     console.log("captcha successfully loaded.");
  // }

  /*
   * Changes the verfied state to true following a verified captcha result.
   */
  // verifyCallback(response) {
  //     if (response) this.setState({isVerified: true});
  //     else this.setState({isVerified: false});
  // }

  render() {
    return (
      <div className="RegisterBox">
        <h2>Create Event</h2>
        <p>
          <b>Please fill out the information below.</b>
        </p>
        <div>
          <Form>
            <div class="add-margin">
              <Form.Group className="mb-3">
                <Form.Label>Enter Event Name</Form.Label>
                <Form.Control
                  required
                  onChange={(target) =>
                    this.setState({ eventName: target.target.value })
                  }
                  value={this.state.eventName}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Enter Location</Form.Label>
                <Form.Control
                  required
                  onChange={(target) =>
                    this.setState({ eventLocation: target.target.value })
                  }
                  value={this.state.eventLocation}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Enter Date</Form.Label>
                <Form.Control
                  type="date"
                  required
                  onChange={(target) =>
                    this.setState({ eventDate: target.target.value })
                  }
                  value={this.state.eventDate}
                />
              </Form.Group>
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <Form.Group>
                  <Form.Label>Enter Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    required
                    onChange={(target) =>
                      this.setState({ eventStartTime: target.target.value })
                    }
                    value={this.state.eventStartTime}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Enter End Time</Form.Label>
                  <Form.Control
                    type="time"
                    required
                    onChange={(target) =>
                      this.setState({ eventEndTime: target.target.value })
                    }
                    value={this.state.eventEndTime}
                  />
                </Form.Group>
              </div>
              <br />
              <Form.Label>Enter Event Team Capacities:</Form.Label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <Form.Group className="mb-3" style={{ margin: "4px" }}>
                  <Form.Label style={{ fontSize: "12px" }}>Total</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    onChange={(target) =>
                      this.setState({ teamsPerEvent: target.target.value })
                    }
                    value={this.state.teamsPerEvent}
                  />
                </Form.Group>
                <Form.Group className="mb-3" style={{ margin: "4px" }}>
                  <Form.Label style={{ fontSize: "12px" }}>Beginner</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    onChange={(target) =>
                      this.setState({
                        beginnerTeamsPerEvent: target.target.value,
                      })
                    }
                    value={this.state.beginnerTeamsPerEvent}
                  />
                </Form.Group>
                <Form.Group className="mb-3" style={{ margin: "4px" }}>
                  <Form.Label style={{ fontSize: "12px" }}>Advanced</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    onChange={(target) =>
                      this.setState({
                        advancedTeamsPerEvent: target.target.value,
                      })
                    }
                    value={this.state.advancedTeamsPerEvent}
                  />
                </Form.Group>
              </div>
              <Form.Label>Enter School Team Capacities:</Form.Label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <Form.Group className="mb-3" style={{ margin: "4px" }}>
                  <Form.Label style={{ fontSize: "12px" }}>Total</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    onChange={(target) =>
                      this.setState({ teamsPerSchool: target.target.value })
                    }
                    value={this.state.teamsPerSchool}
                  />
                </Form.Group>
                <Form.Group className="mb-3" style={{ margin: "4px" }}>
                  <Form.Label style={{ fontSize: "12px" }}>Beginner</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    onChange={(target) =>
                      this.setState({
                        beginnerTeamsPerSchool: target.target.value,
                      })
                    }
                    value={this.state.beginnerTeamsPerSchool}
                  />
                </Form.Group>
                <Form.Group className="mb-3" style={{ margin: "4px" }}>
                  <Form.Label style={{ fontSize: "12px" }}>Advanced</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    onChange={(target) =>
                      this.setState({
                        advancedTeamsPerSchool: target.target.value,
                      })
                    }
                    value={this.state.advancedTeamsPerSchool}
                  />
                </Form.Group>
              </div>
              <Form.Group className="mb-3">
                <Form.Label>Enter Description</Form.Label>
                <Form.Control
                  required
                  as="textarea"
                  rows="8"
                  onChange={(target) =>
                    this.setState({ description: target.target.value })
                  }
                  value={this.state.description}
                />
              </Form.Group>
              {/* <div align="center">
                            <ReCAPTCHA
                                sitekey="6LdB8YoUAAAAAL5OtI4zXys_QDLidEuqpkwd3sKN"
                                render="explicit"
                                onloadCallback={this.recaptchaLoaded}
                                verifyCallback={this.verifyCallback}
                            />
                        </div> */}
            </div>
            <Button
              id="purple-button"
              onClick={(event) => this.handleRegisterEvent(event)}
            >
              Register Event
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

/**
 * Redux initializes props.
 */
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    errors: state.errors,
  };
};

/**
 * Redux updates props.
 */
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchResetErrors: () => dispatch(clearErrors()),
    dispatchError: (message) => dispatch(updateErrorMsg(message)),
    dispatchSuccess: (message) => dispatch(updateSuccessMsg(message)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent);
