/*
MIT License
Copyright (c) 2022 KSU-CS-Software-Engineering
*/
import React, {Component} from "react";
import StatusMessages from "../../../_common/components/status-messages/status-messages.jsx";
import UpgradeService from "../../../_common/services/team-request.js";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
// import ReactTable from "react-table";
// import "react-table/react-table.css";
import {connect} from "react-redux";
// import "../../_common/assets/css/ReactTableCSS.css";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../../_store/slices/errorSlice.js";
import { Table } from "react-bootstrap"

var currentView = null;

/*
 * @author: Daniel Bell and Jacob Beck
 */
class TeamRequests extends Component {
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
        UpgradeService.getAllTeams()
            .then((response) => {
                if (response.statusCode === 200) {
                    this.setState({requestTable: JSON.parse(response.body)});
                } else console.log("An error has occurred, Please try again.");
            })
            .catch((resErr) => console.log("Something went wrong. Please try again"));
    };

    /*
     * Helper function for generateRequestTable. Updates the users AccessLevel.
     */
    handleAcceptRequest = (teamName) => {
        UpgradeService.acceptTeam(teamName)
            .then((response) => {
                if (response.statusCode === 200) {
                    this.componentDidMount();
                } else console.log("An error has occurred, Please try again.");
            })
            .catch((resErr) => console.log("Something went wrong. Please try again"));
    };

    /*
     * Helper function for generateRequestTable. Deletes the user from the database.
     */
    handleDenyRequest = (teamName) => {
        UpgradeService.removeTeam(teamName)
            .then((response) => {
                if (response.statusCode === 200) {
                    this.componentDidMount();
                } else console.log("An error has occurred, Please try again.");
            })
            .catch((resErr) => console.log("Something went wrong. Please try again"));
    };

    /*
     *  Maps the database to the correct columns
     *  Don't mess with it, it works :D
     */
    getColumns() {
        return [
            {
                Header: "Team Name",
                accessor: "teamname",
                Cell: (row) => <div style={{textAlign: "left"}}>{row.value}</div>,
            },
            {
                Header: "School Name",
                accessor: "schoolname",
                Cell: (row) => <div style={{textAlign: "left"}}>{row.value}</div>,
            },
            {
                Header: "Address Line 1",
                accessor: "addressline1",
                Cell: (row) => <div style={{textAlign: "left"}}>{row.value}</div>,
            },
            {
                Header: "Address Line 2",
                accessor: "addressline2",
                Cell: (row) => <div style={{textAlign: "left"}}>{row.value}</div>,
            },
            {
                Header: "City",
                accessor: "city",
                Cell: (row) => <div style={{textAlign: "left"}}>{row.value}</div>,
            },
            {
                Header: "State",
                accessor: "state",
                Cell: (row) => <div style={{textAlign: "left"}}>{row.value}</div>,
            },
            {
                Header: "USD",
                accessor: "usdcode",
                Cell: (row) => <div style={{textAlign: "right"}}>{row.value}</div>,
            },
            {
                Header: "Question Level",
                accessor: "questionlevel",
                Cell: (row) => <div style={{textAlign: "left"}}>{row.value}</div>,
            },
            {
                Header: "Email",
                accessor: "email",
                Cell: (row) => <div style={{textAlign: "left"}}>{row.value}</div>,
            },
            {
                Header: "Activate",
                Cell: (cell) => (
                    <div>
                        {/*TODO: Replace STYLE*/}
                        <FontAwesomeIcon icon="badge-check"
                                         onClick={() => this.handleAcceptRequest(cell.row.teamname)}
                                         style={{
                                             marginRight: "25px",
                                             color: "green",
                                             size: "21px",
                                             cursor: "pointer",
                                         }}
                        />
                        <FontAwesomeIcon icon="trash-can"
                                         onClick={() => this.handleDenyRequest(cell.row.teamname)}
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
                <h2>Team Requests</h2>

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

export default connect(mapStateToProps, mapDispatchToProps)(TeamRequests);
