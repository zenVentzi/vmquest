import React from 'react';
import styled from 'styled-components';
import UserProfile from '../userProfile';

const StyledContent = styled.div`
  margin: 70px 0;`;

const Content = () => (
  <StyledContent>
    <UserProfile />
  </StyledContent>
);

export default Content;
