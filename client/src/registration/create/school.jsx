/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, {Component} from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import schoolService from "../../_common/services/school.js";
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
            schoolName: null,
            addressLine1: null,
            addressLine2: "",
            city: null,
            state: null,
            postalCode: null,
            usdCode: null,
        };
    }

    /*
     * Handles the registration of teams and adds the team information to the SQL database.
     */
    handleRegisterSchool = () => {
        // if (this.state.isVerified) {
        schoolService.registerSchool(
                this.state.schoolName,
                this.state.addressLine1,
                this.state.addressLine2,
                this.state.city,
                this.state.state,
                parseInt(this.state.postalCode),
                parseInt(this.state.usdCode)
            )
            .then((response) => {
                if (response.status === 200 || response.status === 201) {
                    this.props.dispatchSuccess("School Registration Successful!");
                } else {
                    this.props.dispatchError("Error Creating School");
                }
            })
            .catch((error) => {
                this.props.dispatchError("Error Querying Server");
            });
    };

    /*
     * Renders the form to be filled out for creating/registering a school
     * Uses same elements as previous forms
     *
     */
    render() {
        return (
            <div className="RegisterBox">
                <h2>Register School</h2>
                <p>
                    <b>Please fill out the information below.</b>
                </p>
                <div>
                    <Form onSubmit={(event) => this.handleRegisterSchool(event)}>
                        <div class="add-margin">
                            <Form.Group>
                                <Form.Label>Enter School Name</Form.Label>
                                <Form.Control required
                                onChange={(target => this.setState({ schoolName: target.target.value }))} value={ this.state.schoolName }/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label>Address Line 1</Form.Label>
                                <Form.Control required
                                onChange={(target => this.setState({ addressLine1: target.target.value }))} value={ this.state.addressLine1 }/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label>Address Line 2</Form.Label>
                                <Form.Control
                                onChange={(target => this.setState({ addressLine2: target.target.value }))} value={ this.state.addressLine2 }/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label>Enter City Name</Form.Label>
                                <Form.Control required
                                onChange={(target => this.setState({ city: target.target.value }))} value={ this.state.city }/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label>Enter State Code</Form.Label>
                                <Form.Control required placeholder="EX: KS"
                                onChange={(target => this.setState({ state: target.target.value }))} value={ this.state.state }/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label>Enter Postal Code</Form.Label>
                                <Form.Control required
                                onChange={(target => this.setState({ postalCode: target.target.value }))} value={ this.state.postalCode }/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label>Enter USD Code</Form.Label>
                                <Form.Control type="number" required placeholder="###'s Only"
                                onChange={(target => this.setState({ usdCode: target.target.value }))} value={ this.state.usdCode }/>
                            </Form.Group>
                        </div>
                        <br/>
                        {/* <div align="center">
                            <ReCAPTCHA
                                class="Captcha"
                                sitekey="6LdB8YoUAAAAAL5OtI4zXys_QDLidEuqpkwd3sKN"
                                render="explicit"
                                onloadCallback={this.recaptchaLoaded}
                                verifyCallback={this.verifyCallback}
                            />
                        </div> */}
                        <Button id="purple-button" onClick={(event) => this.handleRegisterSchool(event)}>Register School</Button>
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
