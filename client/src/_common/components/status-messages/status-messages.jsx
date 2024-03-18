/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
React Bootstrap for CSS
*/
import React from "react";
import "./status-messages.css";
import Alert from 'react-bootstrap/Alert';
import { connect } from "react-redux";
import CloseButton from 'react-bootstrap/CloseButton';
import { clearErrors } from "../../../_store/slices/errorSlice";
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

export function StatusMessages(props){
  return (
    <div>
      {props.errors.errorMsg ? (
        <Alert
          severity="danger"
          style={{
            fontSize: "16px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {props.errors.errorMsg}
          <div>
            <CloseButton onClick={() => props.dispatchResetErrors()} />
          </div>
        </Alert>
      ) : props.errors.successMsg ? (
        <Alert
          severity="success"
          style={{
            fontSize: "16px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {props.errors.successMsg}
          <div>
            <CloseButton onClick={() => props.dispatchResetErrors()} />
          </div>
        </Alert>
      ) : (
        ""
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    errors: state.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchResetErrors: () => dispatch(clearErrors()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusMessages);