import React from 'react';
import ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/main/App';
import rootReducer from './reducers';
import {
  fetchUsersIfNeeded,
  clearAnswer,
  editAnswer,
} from './actions/actionCreators';

const logger = createLogger();

/* eslint-disable no-underscore-dangle */
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk, logger),
);
/* eslint-enable */

ReactDOM.render(
  <Provider store={store} >
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app'),
);

// eslint-disable-next-line
injectGlobal`
  body {
    font-family: "Arial Black", Gadget, sans-serif;
  }
`;

