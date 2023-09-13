import React, { Component } from 'react';
import '../_common/assets/css/question-button.css';

const types = [
    { text: 'Incorrect', class: 'answer-red', pointsAdded: -1 },
    { text: 'Correct', class: 'answer-yellow', pointsAdded: 0.5 },
    { text: 'Correct', class: 'answer-green', pointsAdded: 0.5 }
];

/*
* @author: Daniel Bell
*/
export default class ScoreboardTile extends Component {
    render() {
        return (
            <div className={types[this.props.timesClicked].class} id="tiles" key={this.key}>
                Question {this.props.questionNum + 1}<br />{types[this.props.timesClicked].text}
            </div>
        );
    }
}