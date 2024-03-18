/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, {Component} from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
//import ReCAPTCHA from "react-recaptcha";
import eventService from "../../_common/services/event";
import "../../_common/assets/css/create-event.css";
import { withRouter } from "../../_utilities/routerUtils"
import PropTypes from "prop-types";
import {connect} from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";

/*
 * @author: Daniel Bell, Trent Kempker
 * Updated: Natalie Laughlin - added eventName
 */
class CreateEvent extends Component {
    constructor(props) {
        super(props);
        this.props.dispatchResetErrors();
        //this.recaptchaLoaded = this.recaptchaLoaded.bind(this);
        this.verifyCallback = this.verifyCallback.bind(this);
        this.state = {
            eventName: "",
            eventLocation: "",
            eventDate: "",
            eventTime: "",
            teamsPerSchool: "",
            teamsPerEvent: "",
            description: "",
            isVerified: false,
        };
    }

    /*
     * Creates a new event and adds the corresponding information to the database.
     */
    handleRegister(event) {
        if (this.state.isVerified) {
            eventService
                .createEvent(
                    this.state.eventName,
                    this.state.eventLocation,
                    this.state.eventDate,
                    this.state.eventTime,
                    this.state.teamsPerSchool,
                    this.state.teamsPerEvent,
                    this.state.description
                )
                .then((response) => {
                    if (response.statusCode === 201) {
                        this.props.dispatchError("Event scheduled successfully.");
                        window.location.reload(); //sends the page back dashboard adding an event Natalie Laughlin
                    } else
                        this.props.dispatchError("There was an issue scheduling an event.");
                })
                .catch((error) => {
                    this.props.dispatchError("There was an issue scheduling an event.");
                });
        } else {
            this.props.dispatchError("Please verify you are a human.");
        }
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
                <h2>Schedule Event</h2>
                <p>
                    <b>Please fill out the information below.</b>
                </p>
                <div>
                    {/* TODO: check if onChange is needed, remove custom style and replace with CSS */}
                    <Form>
                        <Form.Group>
                            <Form.Label>Enter Event Name</Form.Label>
                            <Form.Control
                                type="text"
                                style={{margin: "10px", marginBottom: "20px"}}
                                inputProps={{style: {fontSize: 14}}}
                                InputLabelProps={{style: {fontSize: 14}}}
                                onChange={(event) =>
                                    this.setState({eventName: event.target.value})
                                }
                                size="small"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Enter Location</Form.Label>
                            <Form.Control
                                type="text"
                                style={{margin: "10px", marginBottom: "20px"}}
                                inputProps={{style: {fontSize: 14}}}
                                InputLabelProps={{style: {fontSize: 14}}}
                                onChange={(event) =>
                                    this.setState({eventLocation: event.target.value})
                                }
                                size="small"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Event Date</Form.Label>
                            <Form.Control
                                type="date"
                                size="small"
                                style={{margin: 10}}
                                inputProps={{style: {fontSize: 14}}}
                                InputLabelProps={{style: {fontSize: 14}}}
                                onChange={(event) =>
                                    this.setState({eventDate: event.target.value})
                                }
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.FloatingLabel label={"Time"}>
                                <Form.Control
                                    type="time"
                                    size="small"
                                    style={{margin: 10, width: "12%"}}
                                    inputProps={{style: {fontSize: 14}}}
                                    InputLabelProps={{style: {fontSize: 14}}}
                                    onChange={(event) =>
                                        this.setState({eventTime: event.target.value})
                                    }
                                />
                            </Form.FloatingLabel>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Number of Teams per School</Form.Label>
                            <Form.Control
                                type="number"
                                size="small"
                                style={{margin: 10}}
                                inputProps={{style: {fontSize: 14}}}
                                InputLabelProps={{style: {fontSize: 11}}}
                                onChange={(event) =>
                                    this.setState({teamsPerSchool: event.target.value})
                                }
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Max Number of Teams for event</Form.Label>
                            <Form.Control
                                type="number"
                                size="small"
                                style={{margin: 10}}
                                inputProps={{style: {fontSize: 14}}}
                                InputLabelProps={{style: {fontSize: 11}}}
                                onChange={(event) =>
                                    this.setState({teamsPerEvent: event.target.value})
                                }
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label></Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Description"
                                id="message"
                                className="form-control"
                                rows="5"
                                value={this.state.message}
                                onChange={(e) => this.setState({description: e.target.value})}
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
                        <Button
                            variant="primary"
                            className="RegisterButton"
                            label="Register Event"
                            style={{
                                margin: 15,
                                backgroundColor: "#00a655",
                                color: "white",
                                fontSize: 14,
                            }}
                            onClick={(event) => this.handleRegister(event)}
                        >
                            Register Event
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }
}

CreateEvent.propTypes = {
    errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
    return {
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(CreateEvent)); //TODO: Replace, this is deprecated

