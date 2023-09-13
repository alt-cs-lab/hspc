import React from 'react';
import Volunteer from './volunteer';
import './stylesheet.css';

/*
*   @author: Trey Moddelmog
*/
export default class volunteerList extends React.Component {
    render() {
        let label = this.props.label;
        let buttonStyle = this.props.buttonStyle;

        let volunteersList = this.props.volunteers.map((v) => {
            return <Volunteer
                key={v.userid}
                id={v.userid}
                name={v.firstname + ' ' + v.lastname}
                label={label}
                buttonStyle={buttonStyle}
                onClick={this.props.onClick}
                />;
        });

        return (
            <ul className={'list'}>
                {volunteersList}
            </ul>
        );
    }
}