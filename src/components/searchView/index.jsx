import React from 'react';
import { parse } from 'qs';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import StyledView from '../.reusable/StyledView';
import User from './User';

const GET_USERS = gql`
  query GetUsers($match: String) {
    users(match: $match) {
      id,
      name,
    }
  }`;

function getMatchParam() {
  return parse(window.location.search.substr(1)).match;
}


const SearchView = () => {
  const renderUsers = (users) => {
    const userList = users.map((user) => {
      const test = 5;

      return (
        <User
          key={user.id}
          avatarSrc={user.avatarSrc}
          username={user.name}
        />
      );
    });

    return userList;
  };

  const renderNotFound = () => (<div> No matches found </div>);

  const renderSearch = (users) => {
    const hasMatchingUsers = users.length > 0;

    if (hasMatchingUsers) {
      return renderUsers(users);
    }

    return renderNotFound();
  };

  return (
    <StyledView>
      <Query
        query={GET_USERS}
        variables={{ match: getMatchParam() }}
      >
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
          console.log(data);

          return <div> {renderSearch(data.users)} </div>;
        }}
      </Query>
    </StyledView>
  );
};

export default SearchView;