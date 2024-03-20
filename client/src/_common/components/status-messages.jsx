/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
React Bootstrap for CSS
*/
import React from "react";
import Alert from 'react-bootstrap/Alert';
import { connect } from "react-redux";
import CloseButton from 'react-bootstrap/CloseButton';
import { clearErrors } from "../../_store/slices/errorSlice";
/*
 * Class to dislay status messages - success or errors
 *
 * @updated 2024: Trent Powell
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
            background: "red"
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
            background: "green"
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