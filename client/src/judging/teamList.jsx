import React from 'react';
import Team from './team';
import './stylesheet.css';

/*
*   @author: Trey Moddelmog
*/
export default class teamList extends React.Component {
    render() {
        const teams = this.props.teams;
        const teamsList = teams.map((t) => {
            return <Team
                    key={t.teamid}
                    id={t.teamid}
                    name={t.teamname}
                    schoolname={t.schoolname}
                    handleTeam={this.props.handleTeam}
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