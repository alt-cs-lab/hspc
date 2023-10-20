/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, {Component} from "react";
import StatusMessages from "../../_common/components/status-messages/status-messages.jsx";
import UpgradeService from "../../_common/services/upgrade";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
// import ReactTable from "react-table";
// import "react-table/react-table.css";
import {connect} from "react-redux";
// import "../../_common/assets/css/ReactTableCSS.css";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";
import { Table } from "react-bootstrap"

class UpgradeRequests extends Component {
    constructor(props) {
        super(props);
        this.props.dispatchResetErrors();
        this.state = {
            requestTable: [],
            columns: this.getColumns(),
        };
    }

    /*
     * Returns a list of all upgrade requests when the component is rendered.
     */
    componentDidMount = () => {
        UpgradeService.getAllUpgrades()
            .then((response) => {
                if (response.statusCode === 200) {
                    this.setState({requestTable: JSON.parse(response.body)}, () => {
                    });
                } else console.log("An error has occurred, Please try again.");
            })
            .catch((resErr) => console.log("Something went wrong. Please try again"));
    };

    /*
     * Helper function for generateRequestTable. Updates the users AccessLevel.
     */
    handleAcceptRequest = (email, level) => {
        console.log("Handler requestLevel: ", level);
        UpgradeService.acceptUpgradeRequest(level, email)
            .then((response) => {
                if (response.statusCode === 200) {
                    this.componentDidMount();
                } else console.log("An error has occurred, Please try again.");
            })
            .catch((resErr) => console.log("Something went wrong. Please try again"));
        if (level === 60) {
            //if the accepted request level was 60 - advisor - we want to call the makeAdvisor method
            UpgradeService.makeAdvisor(email)
                .then((response) => {
                    if (response.statusCode === 200) {
                        this.componentDidMount();
                    } else console.log("An error has occured, Please try again.");
                })
                .catch((resErr) =>
                    console.log("Something went wrong. Please try again")
                );
        }
    };

    /*
     * Helper function for generateRequestTable. Deletes the user from the database.
     */
    handleDenyRequest = (email) => {
        UpgradeService.removeUpgradeRequest(email)
            .then((response) => {
                if (response.statusCode === 200) {
                    this.componentDidMount();
                } else console.log("An error has occurred, Please try again.");
            })
            .catch((resErr) => console.log("Something went wrong. Please try again"));
    };

    /*
     *  Maps the database to the correct columns
     */
    getColumns() {
        return [
            {
                Header: "First Name",
                accessor: "firstname",
                Cell: (row) => <div style={{textAlign: "left"}}>{row.value}</div>,
            },
            {
                Header: "Last Name",
                accessor: "lastname",
                Cell: (row) => <div style={{textAlign: "left"}}>{row.value}</div>,
            },
            {
                Header: "Email",
                accessor: "email",
                Cell: (row) => <div style={{textAlign: "left"}}>{row.value}</div>,
            },
            {
                Header: "Phone",
                accessor: "phone",
                Cell: (row) => <div style={{textAlign: "right"}}>{row.value}</div>,
            },
            {
                Header: "Requested Level",
                Cell: (cell) => (
                    <div style={{textAlign: "left"}}>
                        {cell.original.requestlevel === 1 ? (
                            <span>Student</span>
                        ) : cell.original.requestlevel === 20 ? (
                            <span>Volunteer</span>
                        ) : cell.original.requestlevel === 40 ? (
                            <span>Judge</span>
                        ) : cell.original.requestlevel === 60 ? (
                            <span>Advisor</span>
                        ) : cell.original.requestlevel === 80 ? (
                            <span>Admin</span>
                        ) : cell.original.requestlevel === 100 ? (
                            <span>Master</span>
                        ) : (
                            <span></span>
                        )}
                    </div>
                ),
            },
            {
                Header: "Activate",
                Cell: (cell) => (
                    <div>

                        {/*TODO: Replace STYLE*/}
                        <FontAwesomeIcon icon="badge-check"
                                         onClick={() => {
                                             console.log("requestLevel:", cell.original.requestlevel);
                                             this.handleAcceptRequest(
                                                 cell.row.email,
                                                 cell.original.requestlevel
                                             );
                                         }}
                                         style={{
                                             marginRight: "25px",
                                             color: "green",
                                             size: "21px",
                                             cursor: "pointer",
                                         }}
                        />
                        <FontAwesomeIcon icon="trash-can"
                                         onClick={() => this.handleDenyRequest(cell.row.email)}
                                         style={{
                                             marginLeft: "10px",
                                             color: "red",
                                             size: "21px",
                                             cursor: "pointer",
                                         }}
                        />
                    </div>
                ),
            },
        ];
    }

    /*
     * Renders the component UI
     */
    render() {
        return (
            <div>
                <StatusMessages/>
                <h2>User Upgrade Requests</h2>

                <Table data={this.state.eventTable} columns={this.state.columns}/>

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

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeRequests);
