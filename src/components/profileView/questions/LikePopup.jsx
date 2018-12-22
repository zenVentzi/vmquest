import React, { Component } from 'react';
import styled from 'styled-components';

const LikePopupWrapper = styled.div`
  position: relative;
  width: 1.5em;
  height: 1.5em;
  background: white;
  color: black;
`;

class LikePopup extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.onTimeOut();
    }, 2000);
  }
  render() {
    const { numOfLikes } = this.props;
    return <LikePopupWrapper>5</LikePopupWrapper>;
  }
}

export default LikePopup;