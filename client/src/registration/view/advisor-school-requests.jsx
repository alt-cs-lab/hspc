/*
MIT License
Copyright (c) 2024 KSU-CS-Software-Engineering
*/
import React, {Component} from "react";
import RequestService from "../../_common/services/request";
import {connect} from "react-redux";
import DataTable from "react-data-table-component";
import { clearErrors, updateErrorMsg, updateSuccessMsg } from "../../_store/slices/errorSlice.js";
import { Button } from "react-bootstrap"

const styles = require('../../_utilities/styleConstants.js');

class SchoolRequests extends Component {
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
        RequestService.getAllSchoolRequests()
            .then((response) => {
                if (response.ok) {
                    this.setState({requestTable: response.data}, () => {
                    });
                } else console.log("An error has occurred retrieving school requests, Please try again.");
            })
            .catch((resErr) => console.log("Something went wrong connecting to the server. Please try again"));
    };

    /*
     * Helper function for when a request is approved or denied.
     */
    handleCompleteRequest(approved, advisorid, schoolid) {
        RequestService.completeSchoolRequest( approved, schoolid, advisorid)
        .then((response) => {
            if (response.status === 200) {
                if(approved){
                    this.props.dispatchSuccess(
                        "School Approved Successfully."
                    )
                }
                else{
                    this.props.dispatchSuccess(
                        "School Denied Successfully."
                    );
                }
                // TODO TWP: Look more into if this works calling component did mount to reload the page. We could instead call a reload function that simply reloads the table.
                this.componentDidMount()
            }
        })
        .catch((error) => {
            this.props.dispatchError(
                "There was an error completing the request. Please Try Again Later!"
            );
        });
    };

    /*
     *  Maps the database to the correct columns
     */
    getColumns() {
        return [
            {
                name: "First Name",
                selector: (row) => row.firstname,
                sortable: true,
            },
            {
                name: "Last Name",
                selector: (row) => row.lastname,
                sortable: true,
            },
            {
                name: "Email",
                selector: (row) => row.email,
                sortable: true,
            },
            {
                name: "Phone",
                selector: (row) => row.phone,
                sortable: true,
            },
            {
                name: "School Name",
                selector: (row) => row.schoolname,
                sortable: true,
            },
            {
                name: "Approve Request",
                cell: row => {
                return(
                    <Button id="purple-button" style={styles.buttonStyles} onClick={() => {this.handleCompleteRequest(true, row.userid, row.schoolid);}}>
                        Approve
                    </Button>
                    );
                }
            },
            {
                name: "Deny Request",
                cell: row => {
                    return(
                    <Button variant="secondary" onClick={() => this.handleCompleteRequest(false, row.userid, row.schoolid)} >
                        Deny
                    </Button>
                    );
                }
            }
        ];
    }

    /*
     * Renders the component UI
     */
    render() {
        return (
            <div id="student-data-table">
                <h2>Advisor School Requests</h2>
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

export default connect(mapStateToProps, mapDispatchToProps)(SchoolRequests);
