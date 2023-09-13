import React from 'react';
import ActiveVolunteer from './activeVolunteer';
import './stylesheet.css';

/*
*   @author: Trey Moddelmog
*/
export default class activeVolunteerList extends React.Component {
    render() {
        let volunteersList = this.props.volunteers.map((v) => {
            return <ActiveVolunteer
                key={v.userid}
                id={v.userid}
                volunteer={v}
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