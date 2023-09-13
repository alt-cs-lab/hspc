import React from 'react';
import { Button } from 'react-bootstrap';
import './stylesheet.css';

/*
*   @author: Trey Moddelmog
*/
export default class volunteer extends React.Component {
    render() {
        return (
            <li className={'listItem'}>
                {this.props.name}
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