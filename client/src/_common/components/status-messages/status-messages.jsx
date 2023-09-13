/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
React Bootstrap for CSS
*/
import React from "react";
import "./status-messages.css";
import Alert from 'react-bootstrap/Alert';
import { connect } from "react-redux";
/*
 * Class to dislay status messages - success or errors
 *
 * @updated 2020: Tyler Trammell
 */

/*
 * Updated how error and success messages work
 * Everything is mostly done through the redux _store
 * It works, don't mess with it....
 * @updated 2021: Cody Reeves, Jonathan Welch
 */

export class StatusMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: this.props.errors.errorMsg,
      successMessage: this.props.errors.successMsg,
    };
  }

  render() {
    return (
      <div>
        {this.state.errorMessage !== "" ? (
          <Alert
            severity="danger"
            style={{
              fontSize: "16px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {this.state.errorMessage}
          </Alert>
        ) : this.state.successMessage !== "" ? (
          <Alert
            severity="success"
            style={{
              fontSize: "16px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {this.state.successMessage}
          </Alert>
        ) : (
          ""
        )}
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

export default connect(mapStateToProps)(StatusMessages);
