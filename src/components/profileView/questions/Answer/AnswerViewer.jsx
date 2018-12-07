import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

const Viewer = styled.div`
  background: black;
  color: white;
  width: 100%;
  padding: 0.2em 1em;
  border-radius: 0.2em;
  word-wrap: break-word;
  text-align: center;
`;

// could be made stateless
class AnswerViewer extends Component {
  render() {
    const { answer } = this.props;

    return <Viewer>{answer.value}</Viewer>;
  }
}

export default AnswerViewer;
