import React, {Component} from "react";
import NewsService from "../_common/services/news";
import StatusMessages from "../_common/components/status-messages/status-messages";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "../_common/assets/css/create-news.css";
import {
    UPDATE_SUCCESS_MSG,
    UPDATE_ERROR_MSG,
    CLEAR_ERRORS,
} from "../_store/actions/types";
import {connect} from "react-redux";

/*
 * @author: Daniel Bell
 */
class CreateNews extends Component {
    constructor(props) {
        super(props);
        this.props.dispatchResetErrors();
        this.handlePublisUpdate = this.handlePublisUpdate.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleSubheadingChange = this.handleSubheadingChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.state = {
            title: "",
            subheading: "",
            message: "",
            date: "",
        };
    }

    /*
     * Publishes the information to the homescreen.
     * @edited by Natalie Laughlin - added redirect
     */
    handlePublisUpdate() {
        const {dispatch} = this.props;
        NewsService.createNews(
            this.state.title,
            this.state.subheading,
            this.state.message,
            this.state.date
        )
            .then((response) => {
                if (response.statusCode === 201) {
                    this.props.dispatchSuccess(
                        "The News Article was published successfully."
                    );
                    window.location.reload();
                } else if (response.statusCode === 400)
                    this.props.dispatchError(
                        "There was an issue publishing the News Article. Please check that the information is correct."
                    );
                else
                    this.props.dispatchError(
                        "There was an issue publishing the News Article."
                    );
            })
            .catch((error) => {
                this.props.dispatchError(
                    "There was an issue publishing the News Article."
                );
            });
    }

    /*
     * Updates the value of this.state.title
     */
    handleTitleChange(event) {
        this.setState({title: event.target.value});
    }

    /*
     * Updates the value of this.state.subheading
     */
    handleSubheadingChange(event) {
        this.setState({subheading: event.target.value});
    }

    /*
     * Updates the value of this.state.message
     */
    handleMessageChange(event) {
        this.setState({message: event.target.value});
    }

    /*
     * Renders the component UI
     */
    render() {
        return (
            <div>
                <StatusMessages/>
                <h2>Create News</h2>
                <p>
                    <b>Please fill out the information below.</b>
                    <br/>
                    The following information will be shared on the home screen
                </p>
                <div>
                    <Form>
                        <Form.Group>
                            <Form.Label>Newsletter Title</Form.Label>
                            <Form.Control
                                type="text"
                                className="contact-form"
                                value={this.state.title}
                                onChange={this.handleTitleChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Subheading</Form.Label>
                            <Form.Control
                                type="text"
                                className="contact-form"
                                value={this.state.subheading}
                                onChange={this.handleSubheadingChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows="10"
                                className="contact-form"
                                value={this.state.message}
                                onChange={this.handleMessageChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Date</Form.Label>
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
                        <Button
                            variant="primary"
                            type={"submit"}
                            className="submit-button"
                            style={{
                                margin: 15,
                                backgroundColor: "#00a655",
                                color: "white",
                                fontSize: 14,
                            }}
                            onClick={(event) => this.handlePublisUpdate(event)}
                        >
                            Publish
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
        dispatchResetErrors: () => dispatch({type: CLEAR_ERRORS}),
        dispatchError: (message) =>
            dispatch({type: UPDATE_ERROR_MSG, payload: message}),
        dispatchSuccess: (message) =>
            dispatch({type: UPDATE_SUCCESS_MSG, payload: message}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateNews);
