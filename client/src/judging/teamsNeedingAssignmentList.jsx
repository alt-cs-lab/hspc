import React from 'react';
import TeamAssignment from './teamsNeedingAssignment';
import './stylesheet.css';

export default class teamsNeedingAssignmentList extends React.Component {
    render() {
        let label = this.props.label;
        let buttonStyle = this.props.buttonStyle;
        const teams = this.props.teams;
        const teamsList = teams.map((t) => {
            return <TeamAssignment
                    key={t.teamid}
                    id={t.teamid}
                    name={t.teamname}
                    schoolname={t.schoolname}
                    label={label}
                    buttonStyle={buttonStyle}         
                    onClick={this.props.onClick}

                    />;
        });

        return (
            <div>
                <ul className={'list'}>
                    {teamsList}
                </ul>
            </div>
        );
    }
}