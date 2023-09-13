/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {loginUser} from "../_store/actions/authActions";
import {Navigate} from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import StatusMessages from "../_common/components/status-messages/status-messages";
import {CLEAR_ERRORS, UPDATE_ERROR_MSG} from "../_store/actions/types";

import "../_common/assets/css/public-login.css";
import "../home/homepage";

/*
 * React class to handle the client login
 *
 * @author: Daniel Bell
 */
class Login extends Component {
    constructor(props) {
        super(props);
        this.props.dispatchResetErrors();
        this.state = {
            loggedIn: false,
            loginRedirectPath: "",
            email: "",
            password: "",
            accessLevel: 0,
            errors: {},
        };
    }

    /*
     *
     * Handles redirecting to the correct dashboard once logged in
     * @param {string} the accessLevel of the user logging in
     */
    getLoginRedirect(accessLevel) {
        switch (accessLevel) {
            case 1:
                return "/student/studentdash";
            case 20:
                return "/volunteer/volunteerdash";
            case 40:
                return "/judge/judgedash";
            case 41:
                return "/judge/judgedash";
            case 60:
                return "/advisor/advisordash";
            case 80:
                return "/admin/admindash";
            case 100:
                return "/master/masterdash";
            default:
                this.props.dispatchError("Invalid access level.");
                return null;
        }
    }

    //TODO: FIX ME?
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            // push user to _____ page when they login
            let url = this.getLoginRedirect(nextProps.auth.user.accessLevel);
            if (url != null) this.props.history.push(url);
        }
    }

    onChange = (e) => {
        // this.props.dispatchResetErrors(); This should work? However it doesn't :(
        this.setState({[e.target.id]: e.target.value});
    };

    onSubmit = (e) => {
        e.preventDefault(); // prevents the page from refreshing the login page
        this.props.dispatchResetErrors();
        if (this.state.email === "") {
            this.props.dispatchError("Email cannot be empty.");
        } else if (this.state.password === "") {
            this.props.dispatchError("Password cannot be empty.");
        }
        const userData = {
            email: this.state.email,
            password: this.state.password,
        };

        this.props.loginUser(userData);
    };

    /*
     * Handles switching between the Registration and Login pages.
     */
    handleSwitch = () => {
        this.props.history.push("/Register");
    };

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.hasOwnProperty("auth") && this.props.auth.isAuthenticated) {
            this.props.history.push("/");
        }
    }

    /*
     * Renders the component UI.
     */
    render() {
        return (
            <div className="LoginBox">
                {this.props.errors.errorMsg !== "" ||
                this.props.errors.successMsg !== "" ? (
                    <StatusMessages/>
                ) : (
                    ""
                )}
                <div style={{height: "100%"}}>
                    <h2>Returning User?</h2>
                    <p>Please enter your email and password below.</p>

                    <Form
                        onSubmit={
                            (event) =>
                                this.onSubmit(
                                    event
                                ) /* to the dood that created a method that needs a param but doesn't pass it in <(") <- penguin*/
                        } //TODO FIX??
                    >
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                style={{margin: "10px"}}
                                inputProps={{style: {fontSize: 14}}}
                                InputLabelProps={{style: {fontSize: 14}}}
                                onChange={(event) => this.setState({email: event.target.value})}
                                size="small"
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                style={{margin: "10px"}}
                                inputProps={{style: {fontSize: 14}}}
                                InputLabelProps={{style: {fontSize: 14}}}
                                onChange={(event) =>
                                    this.setState({password: event.target.value})
                                } //todo: don't think the onchange events are needed here, FIX
                                size="small"
                                required
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            className="login-button"
                            style={{
                                margin: "10px",
                                backgroundColor: "#1C4F53",
                                color: "white",
                                fontSize: "14px",
                            }}
                            type="submit"
                        >
                            Sign In
                        </Button>
                        <Button
                            variant="primary"
                            className="register-button"
                            style={{
                                margin: "10px",
                                backgroundColor: "#00a655",
                                color: "white",
                                fontSize: "14px",
                            }}
                            onClick={this.handleSwitch}
                        >
                            Register
                        </Button>
                    </Form>
                    <br/>
                </div>
                {this.state.loggedIn ? (
                    <Navigate
                        to={{
                            pathname: this.state.loginRedirectPath,
                            state: this.state.email, //TODO: Check this
                        }}
                    />
                ) : null}
            </div>
        );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
});

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchError: (message) =>
            dispatch({type: UPDATE_ERROR_MSG, payload: message}),
        loginUser: (userData) => dispatch(loginUser(userData)),
        dispatchResetErrors: () => dispatch({type: CLEAR_ERRORS}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
