import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import '../_common/assets/css/question-button.css';

const types = [
    {
        text: 'Incorrect',
        class: 'answer-red',
        pointsAdded: -1
    },
    {
        text: 'Correct',
        class: 'answer-yellow',
        pointsAdded: 0.5
    },
    {
        text: 'Correct',
        class: 'answer-green',
        pointsAdded: 0.5
    }
];

/*
* @author: Daniel Bell
*/
export default class QuestionButton extends Component {
    constructor(props) {
        super(props);
        this.questionNum = this.props.questionNum;
        this.rowNum = this.props.rowNum;
        this.timesClicked = 0;
        this.state = {
            type: types[this.timesClicked]
        };
    }

    /*
    * Updates the button information.
    */
    handleUpdateData = () => {
        this.updateTimesClicked();
        const type = types[this.timesClicked];
        this.setState({
            type: type
        }, () => {
            // keep track of questions coorect?
            this.props.onAnswerUpdate(this.rowNum, this.timesClicked, this.questionNum, this.state.type.pointsAdded);
        });
    }

    /*
    * Increments the number of times the button has been clicked.
    */
    updateTimesClicked = () => {
        this.timesClicked++;
        if (this.timesClicked >= types.length) {
            this.timesClicked = 0;
        }
    }

    /*
    * Returns the answer value.
    */
    getAnswer() {
        return this.state.answer;
    }

    /*
    * Returns the button index.
    */
    getIndex = () => {
        return (this.questionNum - 1 < 0) ? 0 : this.questionNum - 1;
    }

    /*
    * Returns wether the button has been marked correcct.
    */
    isCorrect = () => {
        return this.state.answer === 'Correct';
    }

    render() {
        return (
            <Button className={this.state.type.class}
                variant="success"
                key={this.getIndex()}
                id="buttons"
                onClick={() => this.handleUpdateData()}
            >{this.questionNum} {this.state.type.text}</Button>
        );
    }


}