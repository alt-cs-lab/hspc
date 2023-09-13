import React from 'react';
import { Button } from 'react-bootstrap';
import './stylesheet.css';

/*
*   @author: May Phyo
*/
export default class activeteamsNeedingAssignment extends React.Component {
    render() {
        return (
            <li className={'listItem'}>
                {this.props.name + ' - ' + this.props.schoolname}
                <span className={'pull-right'}>
                    <Button
                       
                        onClick={() => {this.props.handleTeamsNeedingAssignment(this.props.id)}}
                        bsStyle="danger">
                            Return
                    </Button>
                </span>
            </li>
        );
    }
}