const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcrypt');
const { mapGqlAnswer } = require('../resolvers/helper');

const edit = async ({ answerId, answerValue }, context) => {
  const {
    models: { Answer },
  } = context;

  const newAnswer = await Answer.findByIdAndUpdate(
    answerId,
    { $set: { value: answerValue } },
    { new: true }
  ).lean();

  return mapGqlAnswer(newAnswer);
};

const add = async ({ questionId, answerValue }, context) => {
  const {
    models: { Answer },
  } = context;

  const { collections } = context;

  const answer = {
    userId: ObjectId(context.user.id),
    questionId: ObjectId(questionId),
    comments: [],
    value: answerValue,
  };

  const newAnswer = await Answer.create(answer);

  return mapGqlAnswer(newAnswer);
};

const remove = async ({ answerId }, context) => {
  const {
    models: { Answer },
  } = context;

  const deletedAnswer = await Answer.findByIdAndDelete(answerId).lean();

  return mapGqlAnswer(deletedAnswer);
};

module.exports = { add, edit, remove };
