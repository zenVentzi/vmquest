import React, { Component } from 'react';
import styled from 'styled-components';

const Text = styled.div`
  width: 80%;
  text-align: center;
  word-wrap: break-word;
  line-height: 1.5em;
  border-radius: 0.2em;
  padding: 0.2em 1em;
`;

class Question extends Component {
  render() {
    const { question } = this.props;
    return <Text> {question} </Text>;
  }
}

export default Question;