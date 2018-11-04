import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import AnswerEditor from './Answer/AnswerEditor';
import Question from './Question';

const StyledQuestion = styled.div`
  width: 100%;
  border-bottom: 2px solid white;
  padding-bottom: 1em;
  margin-bottom: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

class UnansweredQuestion extends Component {
  onClickSave = ({ answerValue }) => {
    const { onClickSave, question } = this.props;

    if (!answerValue && !question.defaultAnswer) {
      toast.error('🦄 Answer not provided');
      return;
    }

    /* else if < minimumAnswerLength .toast.. */

    onClickSave({
      answerValue: answerValue || question.defaultAnswer,
    });
  };

  onClickDoesNotApply = () => {
    this.props.onClickDoesNotApply();
  };

  render() {
    const { question, style } = this.props;

    return (
      <StyledQuestion style={style}>
        <Question question={question.question} />
        <AnswerEditor
          questionType={question.type}
          defaultAnswer={question.defaultAnswer}
          possibleAnswers={question.possibleAnswers}
          onClickSave={this.onClickSave}
          onClickDoesNotApply={this.onClickDoesNotApply}
        />
      </StyledQuestion>
    );
  }
}

export default UnansweredQuestion;
