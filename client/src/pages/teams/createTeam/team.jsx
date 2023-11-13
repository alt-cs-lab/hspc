/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, {Component} from "react";
import StatusMessages from "../../../_common/components/status-messages/status-messages.jsx";
import {ToggleButtonGroup, ToggleButton} from "react-bootstrap";
import ReCAPTCHA from "react-recaptcha";
import Button from 'react-bootstrap/Button';

import Form from 'react-bootstrap/Form'
import teamService from "../../../_common/services/team.js";
import UserService from "../../../_common/services/user.js";
import "../../../_common/assets/css/register-user.css";
import EventService from "../../../_common/services/event.js";
import SchoolService from "../../../_common/services/school.js";
import Select from "react-select";
import {connect} from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../../_store/slices/errorSlice.js";

const selectStyles = {
    menu: (base) => ({
        ...base,
        zIndex: 100,
    }),
};

/*
 * @author: Daniel Bell, Tyler Trammell
 */
class RegisterTeam extends Component {
    constructor(props) {
        super(props);
        this.props.dispatchResetErrors();
        this.state = {
            teamName: "",
            schoolId: null,
            competitionId: null,
            questionLevelId: 1,
            advisorId: null,
            isVerified: false,
            redirect: false,
            eventList: [],
            schoolMaxList: [],
            eventMaxList: [],
            schoolList: [],
            advisorList: [],
            teamList: [],
            eventTeamsList: [],
        };
    }

    /*
     * Returns a list of all events when the component is rendered.
     * Returns a list of all schools when the component is rendered.
     * Returns a list of all advisors when the component is rendered.
     */
    componentDidMount = () => {
        EventService.getAllEvents(
            this.props.auth.user.id,
            this.props.auth.user.accessLevel
        )
            .then((response) => {
                if (response.statusCode === 200) {
                    let body = response.body;
                    let events = [];
                    let competitions = [];
                    let EventMax = [];
                    competitions.push({
                        label: 0,
                        value: 0,
                    });
                    EventMax.push({
                        label: 0,
                        value: 0,
                    });

                    for (let i = 0; i < body.length; i++) {
                        events.push({
                            label: body[i].eventname,
                            value: body[i].competitionid,
                        });
                        competitions.push({
                            label: body[i].competitionid,
                            value: body[i].teamsperschool,
                        });
                        EventMax.push({
                            label: body[i].competitionid,
                            value: body[i].teamsperevent,
                        });
                    }
                    this.setState({eventList: events});
                    this.setState({schoolMaxList: competitions});
                    this.setState({eventMaxList: EventMax});
                } else console.log("An error has occurred, Please try again.");
            })
            .catch((resErr) => console.log("Something went wrong. Please try again"));

        SchoolService.getAllSchools()
            .then((response) => {
                if (response.statusCode === 200) {
                    let schoolbody = JSON.parse(response.body);
                    let schools = [];
                    for (let i = 0; i < schoolbody.length; i++) {
                        schools.push({
                            label: schoolbody[i].schoolname,
                            value: schoolbody[i].schoolid,
                        });
                    }
                    this.setState({schoolList: schools});
                } else console.log("An error has occurred, Please try again.");
            })
            .catch((resErr) => console.log("Something went wrong. Please try again"));

        UserService.getAllAdvisors()
            .then((response) => {
                if (response.statusCode === 200) {
                    let advisorbody = JSON.parse(response.body);
                    let advisors = [];
                    for (let i = 0; i < advisorbody.length; i++) {
                        advisors.push({
                            label: advisorbody[i].email,
                            value: advisorbody[i].userid,
                        });
                    }
                    this.setState({advisorList: advisors});
                } else console.log("An error has occurred, Please try again.");
            })
            .catch((resErr) => console.log("Something went wrong. Please try again"));
    };

    /*
     * Handles the registration of teams and adds the team information to the SQL database.
     */
    handleRegisterTeam = () => {
        if (this.state.isVerified) {
            if (
                this.state.teamName === "" ||
                this.state.schoolId === "" ||
                this.state.competitionId === "" ||
                this.state.advisorId === ""
            ) {
                this.props.dispatchError(
                    "Please check that all the fields are completed."
                );
                return;
            }

            teamService
                .getTeamSchoolEvent(this.state.schoolId, this.state.competitionId)
                .then((response) => {
                    if (response.statusCode === 201 || response.statusCode === 200) {
                        let teamBody = response.body;
                        let teams = [];
                        for (let i = 0; i < response.body.length; i++) {
                            teams.push({
                                label: teamBody[i].teamid,
                                value: teamBody[i].teamname,
                            });
                        }
                        this.setState({teamList: teams});

                        if (
                            this.state.teamList.length <
                            this.state.schoolMaxList[this.state.competitionId].value
                        ) {
                            teamService
                                .getTeamsEventID(this.state.competitionId)
                                .then((response) => {
                                    if (
                                        response.statusCode === 201 ||
                                        response.statusCode === 200
                                    ) {
                                        let teamBody = response.body;
                                        let teams = [];
                                        for (let i = 0; i < response.body.length; i++) {
                                            teams.push({
                                                label: teamBody[i].teamid,
                                                value: teamBody[i].teamname,
                                            });
                                        }
                                        this.setState({eventTeamsList: teams});
                                    }

                                    console.log(this.state.eventMaxList);
                                    console.log(this.state.eventTeamsList);
                                    if (
                                        this.state.eventTeamsList.length <
                                        this.state.eventMaxList[this.state.competitionId].value
                                    ) {
                                        teamService
                                            .registerTeam(
                                                this.state.teamName,
                                                this.state.schoolId,
                                                this.state.competitionId,
                                                this.state.questionLevelId,
                                                this.state.advisorId
                                            )
                                            .then((response) => {
                                                if (response.statusCode === 201) {
                                                    this.props.dispatchSuccess(
                                                        "Registration Successful."
                                                    );
                                                    this.setState({redirect: true});
                                                    this.resetFields();
                                                    window.location.reload();
                                                }
                                            })
                                            .catch((error) => {
                                                this.props.dispatchError(
                                                    "There was an error creating the Team."
                                                );
                                            });
                                    } else {
                                        console.log("Max teams in event reached");
                                        this.props.dispatchError(
                                            "The maximum number of teams for this event has been reached."
                                        );
                                    }
                                });
                        } else {
                            console.log("max teams in school reached");
                            this.props.dispatchError(
                                "The maximum number of teams for this school has already been reached"
                            );
                        }
                    } else
                        console.log(
                            "An error has occurred with valid response, Please try again."
                        );
                })
                .catch((resErr) => {
                    console.log(resErr);
                    console.log(
                        "Something went wrong getting school's events. Please try again"
                    );
                });
        } else {
            this.props.dispatchError("Please verify you are a human.");
        }
    };

    resetFields = () => {
        console.log("Reset");
        this.setState({teamName: ""});
        this.setState({schoolId: 0});
        this.setState({competitionId: 0});
    };

    /*
     * Handle the changing of question level - used in Question Level Toggle.
     * @Param Value: the value that is to be set for questionLevelID
     */
    handleChange = (value, event) => {
        this.setState({questionLevelId: value});
    };

    /*
     * Handle the changing of a school - used in School dropdown.
     * @Param schoolId: the value to be set for the schoolId
     */
    handleSchoolChange = (schoolId) => {
        this.setState({schoolId: schoolId.value});
    };

    /*
     * Handle the changing of a competition - used in Event Date dropdown.
     * @Param competitionId: the value to be set for the competitionId
     */
    handleCompetitionChange = (competitionId) => {
        this.setState({competitionId: competitionId.value});
    };

    /*
     * Handle the changing of an advisor - used in Advisor dropdown.
     * @Param competitionId: the value to be set for the competitionId
     */
    handleAdvisorChange = (advisorId) => {
        this.setState({advisorId: advisorId.value});
    };

    /*
     * Indicates successful loading of the captcha for debugging purposes
     */
    recaptchaLoaded = () => {
        console.log("captcha successfully loaded.");
    };

    /*
     * Changes the verfied state to true following a verified captcha result.
     */
    verifyCallback = (response) => {
        if (response) this.setState({isVerified: true});
        else this.setState({isVerified: false});
    };

    /*
     * Auto-Redirect to the Add Users Page. By default, this renders the registration box.
     */
    render() {
        return (
            <div name="status-div" className="RegisterBox">
                {this.props.errors.errorMsg !== "" ||
                this.props.errors.successMsg !== "" ? (
                    <StatusMessages/>
                ) : (
                    ""
                )}
                <h2>New Team?</h2>
                <p>
                    <b>Please fill out the information below.</b>
                </p>
                <Form>
                    <Form.Group>
                        <Form.Label>Enter your Team Name</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            label=""
                            style={{margin: "10px"}}
                            inputProps={{style: {fontSize: 14}}}
                            InputLabelProps={{style: {fontSize: 13}}}
                            onChange={(event) =>
                                this.setState({teamName: event.target.value})
                            }
                            size="small">
                        </Form.Control>

                    </Form.Group>
                    {/*TODO: Update selects to be bootstrap*/}
                    <div id="sub-nav">
                        <p id="sub-nav-item">
                            <b>School</b>
                        </p>
                        <Select
                            id="dropdown"
                            styles={selectStyles}
                            placeholder="Select a school"
                            options={this.state.schoolList}
                            onChange={this.handleSchoolChange}
                        />
                    </div>
                    <div id="sub-nav">
                        <p id="sub-nav-item">
                            <b>Event</b>
                        </p>
                        <Select
                            id="dropdown"
                            required
                            styles={selectStyles}
                            placeholder="Select an event"
                            options={this.state.eventList}
                            onChange={this.handleCompetitionChange}
                        />
                    </div>
                    <div id="sub-nav">
                        <p id="sub-nav-item">
                            <b>Advisor</b>
                        </p>
                        <Select
                            id="dropdown"
                            required
                            styles={selectStyles}
                            placeholder="Select an advisor"
                            options={this.state.advisorList}
                            onChange={this.handleAdvisorChange}
                        />
                    </div>


                    <br/>
                    <p>
                        <br/>
                        Please select an experience level.
                    </p>
                    <ToggleButtonGroup
                        className="RoleSelect"
                        required
                        type="radio"
                        name="options"
                        defaultValue={1}
                    >
                        <ToggleButton value={1} onClick={() => this.handleChange(1)}>
                            Beginner
                        </ToggleButton>
                        <ToggleButton value={2} onClick={() => this.handleChange(2)}>
                            Advanced
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <br/>
                    <br/>
                    <div align="center">
                        <ReCAPTCHA
                            class="Captcha"
                            sitekey="6LdB8YoUAAAAAL5OtI4zXys_QDLidEuqpkwd3sKN"
                            render="explicit"
                            onloadCallback={this.recaptchaLoaded}
                            verifyCallback={this.verifyCallback}
                        />
                    </div>
                    <Button
                        variant="primary"
                        className="RegisterButton"
                        style={{
                            margin: 15,
                            backgroundColor: "#00a655",
                            fontSize: 14,
                            color: "white",
                        }}
                        type="button"
                        onClick={(event) => this.handleRegisterTeam(event)}
                    >
                        Register Team
                    </Button>
                </Form>
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
            dispatch(updateSuccessMsg(message)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterTeam);
