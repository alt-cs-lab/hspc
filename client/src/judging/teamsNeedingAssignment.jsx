import React from 'react';
import { Button } from 'react-bootstrap';
import './stylesheet.css';

/*
*   @author: May Phyo
*/
export default class teamsNeedingAssignment extends React.Component {
    render() {
        return (
            <li className={'listItem'}>
                {this.props.name + ' - ' + this.props.schoolname}
                <span className={'pull-right'}>
                    <Button
                      
                      onClick={() => this.props.onClick(this.props.id)}
                      bsStyle={this.props.buttonStyle}>
                      {this.props.label}
                             
                    </Button>
                </span>
            </li>
        );
    }
}