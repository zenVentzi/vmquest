import React, { Component, Fragment } from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import { EDIT_ANSWER, ADD_ANSWER } from 'Mutations';
import TextBtn from 'Reusable/TextBtn';
import Answer from './Answer';
import QuestionText from './QuestionText';
import update, { CACHE_ACTIONS } from './CacheQuestions';

const DEFAULT_ANSWER = 3;

const EditorButtons = styled.div`
  display: flex;
  width: 80%;
  justify-content: center;
  & + {
    margin-right: 1em;
  }
`;

class QuestionEditor extends Component {
  state = {
    answerValue: this.props.question.answer
      ? this.props.question.answer.value
      : DEFAULT_ANSWER,
  };

  onClickSave = mutation => async () => {
    await mutation(this.getMutationParams());
    if (this.props.onSaved) this.props.onSaved();
  };

  onChange = editedAnswer => {
    const newState = { ...this.state, answerValue: editedAnswer };
    this.setState(newState);
  };

  getMutationParams = () => {
    const mutationParams = {};
    const variables = {
      answerValue: this.state.answerValue,
    };

    const isNewQuestion = !this.props.question.answer;

    if (isNewQuestion) {
      variables.questionId = this.props.question.id;
      mutationParams.update = update(CACHE_ACTIONS.ADD_ANSWER);
    } else {
      // mutationParams.update = update(CACHE_ACTIONS.EDIT_ANSWER);
      variables.answerId = this.props.question.answer.id;
    }

    mutationParams.variables = variables;
    return mutationParams;
  };

  render() {
    const gqlMutation = this.props.question.answer ? EDIT_ANSWER : ADD_ANSWER;
    return (
      <Mutation mutation={gqlMutation}>
        {mutation => {
          const { question } = this.props;

          return (
            <Fragment>
              <QuestionText> {question.question} </QuestionText>
              <Answer
                viewMode={false}
                question={question}
                onChange={this.onChange}
              />
              <EditorButtons>
                <div>
                  <TextBtn onClick={this.onClickSave(mutation)}>Save</TextBtn>
                  <TextBtn onClick={this.onClickSave(mutation)}>Next</TextBtn>
                </div>
                <TextBtn onClick={this.onClickSave(mutation)}>
                  Does not apply
                </TextBtn>
              </EditorButtons>
            </Fragment>
          );
        }}
      </Mutation>
    );
  }
}

export default QuestionEditor;
