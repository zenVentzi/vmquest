const AUTH_TOKEN = 'AUTH_TOKEN';
const USER_ID = `USER_ID`;

// try make them actually constants
const QuestionTypes = {
  SCALE: `SCALE`,
  TEXT: `TEXT`,
  OPTIONS: `OPTIONS`,
};

const NewsType = {
  NEW_ANSWER: 'NEW_ANSWER',
  NEW_ANSWER_EDITION: 'NEW_ANSWER_EDITION',
  NEW_COMMENT: 'NEW_COMMENT',
  NEW_LIKE: 'NEW_LIKE',
  NEW_FOLLOWER: 'NEW_FOLLOWER',
};

module.exports = { AUTH_TOKEN, USER_ID, QuestionTypes, NewsType };
