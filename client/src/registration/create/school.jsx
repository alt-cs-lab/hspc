/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, {Component} from "react";
import StatusMessages from "../../_common/components/status-messages/status-messages";
import ReCAPTCHA from "react-recaptcha";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import schoolService from "../../_common/services/school.js";
import "../../_common/assets/css/register-user.css";
import {connect} from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice";

/*
 * @author: Tyler Trammell
 * Class that hangdles the client side creation of a school. UI of school creation and passes data service
 */
export class RegisterSchool extends Component {
    constructor(props) {
        super(props);
        this.props.dispatchResetErrors();
        this.state = {
            schoolName: " ",
            addressLine1: " ",
            addressLine2: " ",
            city: " ",
            state: " ",
            postalCode: " ",
            usdCode: " ",
        };
    }

    /*
     * Handles the registration of teams and adds the team information to the SQL database.
     */
    handleRegisterSchool = () => {
        if (this.state.isVerified) {
            if (
                this.state.schoolName === "" ||
                this.state.addressLine1 === "" ||
                this.state.state === "" ||
                this.state.city === "" ||
                this.state.postalCode === ""
            ) {
                this.props.dispatchError("Make more specific");
                return;
            }
            schoolService
                .registerSchool(
                    this.state.schoolName,
                    this.state.addressLine1,
                    this.state.addressLine2,
                    this.state.city,
                    this.state.state,
                    this.state.postalCode,
                    this.state.usdCode
                )
                .then((response) => {
                    if (response.statusCode === 201) {
                        this.props.dispatchSuccess("School Registration Successful!");

                        this.setState({redirect: true});
                        window.location.reload(); //sends the page back after adding a school Natalie Laughlin
                    } else {
                        this.props.dispatchError("Make more specific");
                    }
                })
                .catch((error) => {
                    this.props.dispatchError("Make more specific");
                });
        } else {
            this.props.dispatchError("Please verify you are a human.");
        }
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
     * Renders the form to be filled out for creating/registering a school
     * Uses same elements as previous forms
     *
     */
    render() {
        return (
            <div className="RegisterBox">
                {this.props.errors.errorMsg !== "" ||
                this.props.errors.successMsg !== "" ? (
                    <StatusMessages/>
                ) : (
                    ""
                )}
                <h2>Register School</h2>
                <p>
                    <b>Please fill out the information below.</b>
                </p>
                <div>
                    {/*TODO: Replace STYLE with CSS and check if onchange is needed*/}
                    <Form>
                        <Form.Group>
                            <Form.Label>Enter School Name</Form.Label>
                            <Form.Control
                                type="text"
                                style={{margin: "10px"}}
                                inputProps={{style: {fontSize: 14}}}
                                InputLabelProps={{style: {fontSize: 14}}}
                                onChange={(event) =>
                                    this.setState({schoolName: event.target.value})
                                }
                                size="small">
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Address Line 1</Form.Label>
                            <Form.Control
                                type="text"
                                style={{margin: "10px"}}
                                inputProps={{style: {fontSize: 14}}}
                                InputLabelProps={{style: {fontSize: 14}}}
                                onChange={(event) =>
                                    this.setState({addressLine1: event.target.value})
                                }
                                size="small">
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Address Line 2</Form.Label>
                            <Form.Control
                                type="text"
                                style={{margin: "10px"}}
                                inputProps={{style: {fontSize: 14}}}
                                InputLabelProps={{style: {fontSize: 14}}}
                                onChange={(event) =>
                                    this.setState({addressLine2: event.target.value})
                                }
                                size="small">
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Enter City Name</Form.Label>
                            <Form.Control
                                type="text"
                                style={{margin: "10px"}}
                                inputProps={{style: {fontSize: 14}}}
                                InputLabelProps={{style: {fontSize: 14}}}
                                onChange={(event) => this.setState({city: event.target.value})}
                                size="small">
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Enter State Code</Form.Label>
                            <Form.Control
                                type="text"
                                style={{margin: "10px"}}
                                inputProps={{style: {fontSize: 14}}}
                                InputLabelProps={{style: {fontSize: 14}}}
                                onChange={(event) => this.setState({state: event.target.value})}
                                size="small">
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Enter Postal Code</Form.Label>
                            <Form.Control
                                type="text"
                                style={{margin: "10px"}}
                                inputProps={{style: {fontSize: 14}}}
                                InputLabelProps={{style: {fontSize: 14}}}
                                onChange={(event) =>
                                    this.setState({postalCode: event.target.value})
                                }
                                size="small">
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Enter USD Code</Form.Label>
                            <Form.Control
                                type="text"
                                style={{margin: "10px", marginBottom: "20px"}}
                                inputProps={{style: {fontSize: 14}}}
                                InputLabelProps={{style: {fontSize: 14}}}
                                onChange={(event) => this.setState({usdCode: event.target.value})}
                                size="small">
                            </Form.Control>
                        </Form.Group>
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
                            onClick={(event) => this.handleRegisterSchool(event)}
                        >
                            Register School
                        </Button>
                    </Form>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterSchool);
