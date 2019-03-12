import { Types } from "mongoose";
import * as dbTypes from "../../dbTypes";
import * as gqlTypes from "../../generated/gqltypes";
import { mapQuestion, mapQuestions } from "./gqlMapper";
import { models } from "../../models";

const { ObjectId } = Types;

test("getQuestion() should return question without answer", () => {
  const dbQuestion = new models.question({
    value: "haha?",
    tags: ["fasa"]
  }).toObject();

  const expected: gqlTypes.Question = {
    id: dbQuestion._id.toString(),
    value: "haha?",
    tags: ["fasa"]
  };

  const actual = mapQuestion(
    "",
    // dbQuestion._id.toString() if test passes remove line
    dbQuestion
  );

  expect(actual).toEqual(expected);
});

test("getQuestion() should return question with answer", () => {
  const dbQuestion = new models.question({
    value: "haha?",
    tags: ["fasa"]
  }).toObject();

  const dbAnswer = new models.answer({
    position: 1,
    questionId: dbQuestion._id,
    userId: ObjectId(),
    editions: [{ _id: ObjectId(), date: new Date(), value: "ass" }]
  } as dbTypes.Answer).toObject();

  const expectedQ: gqlTypes.Question = {
    id: dbQuestion._id.toString(),
    value: "haha?",
    tags: ["fasa"]
  };

  const expectedA: gqlTypes.Answer = {
    id: dbAnswer._id.toString(),
    position: dbAnswer.position,
    // value: dbAnswer.value,
    questionId: dbAnswer.questionId.toString(),
    userId: dbAnswer.userId.toString(),
    editions: [
      {
        id: dbAnswer.editions[0]._id.toHexString(),
        date: dbAnswer.editions[0].date,
        value: dbAnswer.editions[0].value,
        comments: null,
        likes: null
      }
    ]
  };

  expectedQ.answer = expectedA;

  const actual = mapQuestion(
    "",
    // dbQuestion._id.toString(), if test passes remove that param
    dbQuestion,
    dbAnswer
  );

  expect(actual).toEqual(expectedQ);
});
