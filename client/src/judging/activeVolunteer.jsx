import React from 'react';
import { Button } from 'react-bootstrap';
import './stylesheet.css';

/*
*   @author: Trey Moddelmog
*/
export default class activeVolunteer extends React.Component {
    render() {
        let v = this.props.volunteer;
        let name = v.firstname + ' ' + v.lastname;
        return (
            <li className={'listItem'}>
                {name}
                <span className={'pull-right'}>
                    <Button
                        onClick={() => this.props.onClick(this.props.id)}
                        bsStyle={'danger'}>
                            return
                    </Button>
                </span>
            </li>
        );
    }
}