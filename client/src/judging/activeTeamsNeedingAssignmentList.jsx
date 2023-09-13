import React from 'react';
import ActiveTeam from './activeTeamsNeedingAssignment';

import './stylesheet.css';

/*
*   @author: Trey Moddelmog
*/
export default class activeteamsNeedingAssignmentList extends React.Component {
    render() {
      
        let  teamsList = this.props.teams.map((t) => {
            return <ActiveTeam
                    key={t.teamid}
                    id={t.teamid}
                    name={t.teamname}
                    schoolname={t.schoolname}
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