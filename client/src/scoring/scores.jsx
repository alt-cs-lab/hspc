import React, { Component } from "react";
import StatusMessages from "../_common/components/status-messages.jsx";
import Button from 'react-bootstrap/Button';
import scorecardService from "../_common/services/scorecard";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "../_common/assets/css/publish-files.css";
import { connect } from "react-redux";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../_store/slices/errorSlice.js";

/*
 * @author: Daniel Bell
 */
class PublishScores extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchResetErrors();
    this.state = {
      upload: [],
    };
  }

  /*
   * Passes uploaded file data to the API for storage in the database.
   * @edit: Natalie Laughlin added a redirect that sends to the dashbaord can be improved
   */
  handlePublish = () => {
    if (this.state.upload.length > 0) {
      scorecardService
        .addScore(this.state.upload[0], "scores")
        .then((response) => {
          if (response.status === 201) {
            this.props.dispatchSuccess(response.data.message);
            window.location.reload();
          } else {
            this.props.dispatchSuccess(response.data.message);
          }
        })
        .catch(() => {
          this.props.dispatchError("There was an issue publishing the scores.");
        });
    } else {
      this.props.dispatchError("No file selected.");
    }
  };

  /*
   * Render the component UI.
   */
  render() {
    return (
      <div className="publish-scores">
        <StatusMessages />
        <h2 id="title">Publish Scores</h2>
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
            Publish Scorecard
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
    dispatchResetErrors: () => dispatch(clearErrors()),
		dispatchError: (message) =>
			dispatch(updateErrorMsg(message)),
		dispatchSuccess: (message) =>
			dispatch(updateSuccessMsg(message))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PublishScores);
