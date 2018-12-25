import { AUTH_TOKEN, USER_ID } from './constants';

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN);
}

const getLoggedUserId = () => {
  const userId = localStorage.getItem(USER_ID);
  // console.log('TCL: getLoggedUserId -> userId', userId);
  return userId;
};

const overrideTheme = neww => current => {
  const res = { ...current, ...neww };
  return res;
};

const saveLoggedUserData = ({ userId, authToken }) => {
  localStorage.setItem(USER_ID, userId);
  localStorage.setItem(AUTH_TOKEN, authToken);
};

const deleteLoggedUserData = () => {
  localStorage.removeItem(USER_ID);
  localStorage.removeItem(AUTH_TOKEN);
};

const inverseColor = color => {
  return color === 'white' ? 'black' : 'white';
};

const inverseTheme = theme => {
  const backgroundColor = inverseColor(theme.backgroundColor);
  const foregroundColor = inverseColor(theme.foregroundColor);
  return { ...theme, backgroundColor, foregroundColor };
};

export {
  getAuthToken,
  getLoggedUserId,
  overrideTheme,
  inverseColor,
  inverseTheme,
  saveLoggedUserData,
  deleteLoggedUserData,
};
