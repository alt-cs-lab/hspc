import React, { Component } from "react";
import StatusMessages from "../_common/components/status-messages/status-messages.jsx";
import Button from 'react-bootstrap/Button';
import practiceService from "../_common/services/practice";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "../_common/assets/css/publish-files.css";
import {
  UPDATE_SUCCESS_MSG,
  UPDATE_ERROR_MSG,
  CLEAR_ERRORS,
} from "../_store/actions/types";
import { connect } from "react-redux";

/*
 * @author: Daniel Bell
 */
class PublishPractice extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.state = {
      upload: [],
    };
  }

  /*
   * Passes uploaded file data to the API for storage in the database.
   * @edited Natalie Laughlin - added redirect to dashboard can be improved
   */
  handlePublish = () => {
    if (this.state.upload.length > 0) {
      practiceService
        .addPractice(this.state.upload[0])
        .then((response) => {
          if (response.status === 201) {
            this.props.dispatchSuccess(
              "The practice problems were published successfully."
            );
            window.location.reload();
          } else {
            this.props.dispatchError(response.data.message);
          }
        })
        .catch(() => {
          this.props.dispatchError(
            "There was an issue publishing the practice problems."
          );
        });
    } else {
      this.props.dispatchError("No file selected.");
    }
  };

  /*
   * Renders the component UI.
   */
  render() {
    return (
      <div className="publish-scores">
        <StatusMessages />
        <h2 id="title">Publish Practice Problems</h2>
        <p>
          <b>Please select a file below</b>
        </p>
        <div>
          <FilePond
            id="uploader"
            name={"file"}
            onupdatefiles={(files) => {
              this.setState({
                upload: files.map((files) => files.file),
              });
            }}
          />
          <Button
            variant="primary"
            className="publish-button"
            style={{
              margin: 15,
              backgroundColor: "#00a655",
              color: "white",
              fontSize: 14,
            }}
            onClick={() => this.handlePublish()}
          >
            Publish Practice Problems
          </Button>
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
    dispatchResetErrors: () => dispatch({ type: CLEAR_ERRORS }),
    dispatchError: (message) =>
      dispatch({ type: UPDATE_ERROR_MSG, payload: message }),
    dispatchSuccess: (message) =>
      dispatch({ type: UPDATE_SUCCESS_MSG, payload: message }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PublishPractice);
