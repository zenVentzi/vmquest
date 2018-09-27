import React from 'react';
import styled from 'styled-components';
import User from 'Reusable/UserRow';

const StyledReaction = styled.div`
  width: 80%;
  display: flex;
  min-height: min-content;
  justify-content: center;
  align-items: center;
  /* margin-bottom: 0.8em; */
`;

const Reaction = ({ reactionIcon: ReactionIcon }) => {
  return (
    <StyledReaction>
      <User size={1.5} />
      {ReactionIcon && <ReactionIcon size="2em" />}
    </StyledReaction>
  );
};

export default Reaction;