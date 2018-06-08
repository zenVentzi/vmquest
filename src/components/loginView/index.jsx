import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import StyledView from '../reusable/StyledView';
import TextInput from '../reusable/TextInput';
import { AUTH_TOKEN } from '../../constants';
import { history } from '../../utils';

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

const LoginView = (props) => {
  let email;
  let password;

  return (
    <StyledView>
      <Mutation
        mutation={LOGIN_MUTATION}
      >
        {(login, { data }) => (
          <div>
            <TextInput placeholder="Email.." type="email" onChange={(e) => { email = e.target.value; }} />
            <TextInput placeholder="Password.." type="password" onChange={(e) => { password = e.target.value; }} />
            <br />
            <button onClick={async () => {
              const variables = {
                email,
                password,
              };
              const result = await login({ variables });
              const token = result.data.login;
              localStorage.setItem(AUTH_TOKEN, token);
              history.push('/');
            }}
            >
             Login
            </button>
          </div>
        )}
      </Mutation>
    </StyledView>
  );
};

export default LoginView;
