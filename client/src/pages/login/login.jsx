/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

import React from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import StatusMessages from "../../_common/components/status-messages/status-messages";
import "../../_common/assets/css/public-login.css";
import "../home/homepage";
import { login, selectAuth } from "../../_store/slices/authSlice";
import { selectDashboardRoute } from "../../_store/slices/routeSlice";
import { clearErrors, updateErrorMsg } from "../../_store/slices/errorSlice";

function Login(props) {
    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector(selectAuth);
    const dashboardRoute = useSelector(selectDashboardRoute);
    const errorMsg = useSelector(state => state.errors.errorMsg);
    const successMsg = useSelector(state => state.errors.successMsg);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    // Unmounting clean up fuction.
    useEffect(() => {
        return () => {
            dispatch(clearErrors());
        }
    }, [dispatch])

    const onSubmit = (e) => {
        e.preventDefault(); // prevents the page from refreshing the login page
        if (email === "") {
            props.dispatchError("Email cannot be empty.");
        } else if (password === "") {
            props.dispatchError("Password cannot be empty.");
        }

        const userData = {
            email: email,
            password: password,
        };

        dispatch(login(userData));
    };

    if (isAuthenticated && dashboardRoute !== "/login") {
        dispatch(clearErrors())
        return <Navigate to={dashboardRoute} />
    }

    if (isRegistering) {
        dispatch(clearErrors())
        return <Navigate to="/register" />
    }

    let errorComponent = errorMsg || successMsg ? <StatusMessages /> : ""

    return (
        <div className="LoginBox">
            {errorComponent}
            <div>
                <h2>Returning User?</h2>
                <p>Please enter your email and password below.</p>

                <Form onSubmit={onSubmit} >
                    <Form.Group controlId="email-input">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            id="email-input"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            size="small"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="password-input">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            id="password-input"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            size="small"
                            required
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        className="login-button login-form-button"
                        type="submit"
                        data-testid="login-button"
                    >
                        Sign In
                    </Button>
                    <Button
                        variant="primary"
                        className="register-button login-form-button"
                        onClick={(_)=> {setIsRegistering(true)}}
                        type="button"
                    >
                        Register
                    </Button>
                </Form>
                <br />
            </div>
        </div>
    );

}

const mapStateToProps = (state) => ({
    errors: state.errors,
});

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchError: (message) =>
            dispatch(updateErrorMsg(message)),
        dispatchResetErrors: () => dispatch(clearErrors()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
