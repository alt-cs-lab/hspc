/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
import React, {Component} from "react";
import StatusMessages from "../../_common/components/status-messages/status-messages.jsx";
import UpgradeService from "../../_common/services/upgrade";

//import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {connect} from "react-redux";
import DataTable from "react-data-table-component";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";
import { Button } from "react-bootstrap"

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
                if (response.ok) {
                    this.setState({requestTable: response.data}, () => {
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
                if (response.ok) {
                    this.componentDidMount();
                } else console.log("An error has occurred, Please try again.");
            })
            .catch((resErr) => console.log("Something went wrong. Please try again"));
        if (level === 60) {
            //if the accepted request level was 60 - advisor - we want to call the makeAdvisor method
            UpgradeService.makeAdvisor(email)
                .then((response) => {
                    if (response.ok) {
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
                if (response.ok) {
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
                name: "First Name",
                selector: (row) => row.firstName
            },
            {
                name: "Last Name",
                selector: (row) => row.lastName
            },
            {
                name: "Email",
                selector: (row) => row.email
            },
            {
                name: "Phone",
                selector: (row) => row.phone
            },
            {
                name: "Requested Level",
                cell: row => {
                    return(
                        <div>
                            {row.requestLevel === 1 ? (
                                <span>Student</span>
                            ) : row.requestLevel === 20 ? (
                                <span>Volunteer</span>
                            ) : row.requestLevel === 40 ? (
                                <span>Judge</span>
                            ) : row.requestLevel === 60 ? (
                                <span>Advisor</span>
                            ) : row.requestLevel === 80 ? (
                                <span>Admin</span>
                            ) : row.requestLevel === 100 ? (
                                <span>Master</span>
                            ) : (
                                <span></span>
                            )}
                        </div>
                    );
                }
            },
            {
                name: "Approve Request",
                cell: row => {
                    return(
                        <Button onClick={() => {
                            console.log("requestLevel:", row.requestLevel);
                            this.handleAcceptRequest(
                                row.email,
                                row.requestLevel
                            );
                            }}
                        >
                            Approve
                        </Button>
                        );
                    }
                },
                {
                    name: "Deny Request",
                    cell: row => {
                        return(
                            <Button onClick={() => this.handleDenyRequest(row.email)} >
                                Deny
                            </Button>
                        );
                    }
                }
                /*Cell: (cell) => (
                    <div>

                        {/*TODO: Replace STYLE*}
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
                ),*/
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
                <DataTable data={this.state.requestTable} columns={this.state.columns}/>
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
