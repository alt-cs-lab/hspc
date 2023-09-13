import React from 'react';
import { Button } from 'react-bootstrap';
import './stylesheet.css';

/*
*   @author: Trey Moddelmog
*/
export default class team extends React.Component {
    render() {
        return (
            <li className={'listItem'}>
                {this.props.name + ' - ' + this.props.schoolname}
                <span className={'pull-right'}>
                    <Button
                        bsStyle="success"
                        onClick={() => this.props.handleTeam(this.props.id)}>
                            Assign
                             
                    </Button>
                </span>
            </li>
        );
    }
}