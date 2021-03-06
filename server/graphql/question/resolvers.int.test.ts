import { Types as GooseTypes } from "mongoose";
import { services } from "../../services";
import { models } from "../../models";
import { Query, Mutation } from "./resolvers";

import * as DbTypes from "../../dbTypes";
import * as GqlTypes from "../autoGenTypes";
import { ApolloContext } from "../../types/gqlContext";

const { ObjectId } = GooseTypes;

const contextUser: DbTypes.User = {
  _id: ObjectId("5c652bcbbe436f0108224888"),
  email: "fdf",
  firstName: "Pesho",
  surName: "Goeshev",
  intro: "blaIntro",
  avatarSrc: "test",
  role: DbTypes.UserRoles.User,
  experience: 0
};

const context: ApolloContext = {
  user: { email: contextUser.email, id: contextUser._id.toHexString() },
  services
};

// TODO test for answeredQUestions and unansweredQuestions

// test("questions() should return questions edges", async done => {
//   const question = { _id: ObjectId(), tags: ["bla"], value: "questionValue" };
//   const question1 = {
//     _id: ObjectId(),
//     tags: ["bla", "shegichka_we_bonak_hihi"],
//     value: "questionValue1"
//   };
//   await new models.question(question).save();
//   await new models.question(question1).save();
//   await new models.user(contextUser).save();

//   const args: GqlTypes.QueryQuestionsArgs = {
//     userId: contextUser._id.toHexString(),
//     answered: false,
//     first: 5
//   };

//   if (typeof Query.questions !== "function") {
//     throw Error(`questions must be a function`);
//   }
//   const questions = await Query.questions({} as any, args, context, {} as any);
//   const actual = questions!.edges!.length;
//   const expected = 2;
//   expect(actual).toEqual(expected);
//   done();
// });

// // tslint:disable-next-line: variable-name
// test("questions() should return total number of questions", async ____done____SERIOUSLY____DONE => {
//   const question = { _id: ObjectId(), tags: ["bla"], value: "questionValue" };
//   const question1 = {
//     _id: ObjectId(),
//     tags: ["bla", "shegichka_we_bonak_hihi"],
//     value: "questionValue1"
//   };
//   await new models.question(question).save();
//   await new models.question(question1).save();
//   await new models.user(contextUser).save();

//   const args: GqlTypes.QueryQuestionsArgs = {
//     userId: contextUser._id.toHexString(),
//     answered: false,
//     first: 5
//   };

//   if (typeof Query.questions !== "function") {
//     throw Error(`questions must be a function`);
//   }

//   const questions = await Query.questions({} as any, args, context, {} as any);
//   const actual = questions!.totalCount;
//   const expected = 2;
//   expect(actual).toEqual(expected);
//   ____done____SERIOUSLY____DONE();
// });

// // tslint:disable-next-line: variable-name
// test("questions() should return correct page info", async __just_a_little_bit_more_and_DONE => {
//   const question = { _id: ObjectId(), tags: ["bla"], value: "questionValue" };
//   const question1 = {
//     _id: ObjectId(),
//     tags: ["bla", "shegichka_we_bonak_hihi"],
//     value: "questionValue1"
//   };
//   await new models.question(question).save();
//   await new models.question(question1).save();
//   await new models.user(contextUser).save();

//   if (typeof Query.questions !== "function") {
//     throw Error(`questions must be a function`);
//   }

//   const questions = await Query.questions(
//     {} as any,
//     {
//       userId: contextUser._id.toHexString(),
//       answered: false,
//       first: 5
//     },
//     context,
//     {} as any
//   );

//   expect(questions!.totalCount).toEqual(2);
//   expect(questions!.pageInfo.startCursor).toEqual(questions!.edges![0].cursor);
//   expect(questions!.pageInfo.endCursor).toEqual(questions!.edges![1].cursor);
//   expect(questions!.pageInfo.hasNextPage).toEqual(false);
//   expect(questions!.pageInfo.hasPreviousPage).toEqual(false);
//   __just_a_little_bit_more_and_DONE();
// });

// test("questions() return pageInfo hasNextPage=true", async done => {
//   const question = { _id: ObjectId(), tags: ["bla"], value: "questionValue" };
//   const question1 = {
//     _id: ObjectId(),
//     tags: ["bla", "shegichka_we_bonak_hihi"],
//     value: "questionValue1"
//   };
//   await new models.question(question).save();
//   await new models.question(question1).save();
//   await new models.user(contextUser).save();

//   if (typeof Query.questions !== "function") {
//     throw Error(`questions must be a function`);
//   }

//   const questions = await Query.questions(
//     {} as any,
//     {
//       userId: contextUser._id.toHexString(),
//       answered: false,
//       first: 1
//     },
//     context,
//     {} as any
//   );

//   expect(questions!.totalCount).toEqual(2);
//   expect(questions!.pageInfo.startCursor).toEqual(questions!.edges![0].cursor);
//   expect(questions!.pageInfo.endCursor).toEqual(questions!.edges![0].cursor);
//   expect(questions!.pageInfo.hasNextPage).toEqual(true);
//   expect(questions!.pageInfo.hasPreviousPage).toEqual(false);
//   done();
// });

// test("questions() return pageInfo hasPreviousPage=true hasNextPage=false", async done => {
//   const question = { _id: ObjectId(), tags: ["bla"], value: "questionValue" };
//   const question1 = {
//     _id: ObjectId(),
//     tags: ["bla", "shegichka_we_bonak_hihi"],
//     value: "questionValue1"
//   };
//   await new models.question(question).save();
//   await new models.question(question1).save();
//   await new models.user(contextUser).save();

//   if (typeof Query.questions !== "function") {
//     throw Error(`questions must be a function`);
//   }

//   const questionsFirstFetch = await Query.questions(
//     {} as any,
//     {
//       userId: contextUser._id.toHexString(),
//       answered: false,
//       first: 1
//     },
//     context,
//     {} as any
//   );

//   const questionsSecondFetch = await Query.questions(
//     {} as any,
//     {
//       userId: contextUser._id.toHexString(),
//       answered: false,
//       first: 1,
//       after: questionsFirstFetch!.pageInfo.endCursor
//     },
//     context,
//     {} as any
//   );

//   expect(questionsSecondFetch!.totalCount).toEqual(2);
//   expect(questionsSecondFetch!.pageInfo.startCursor).toEqual(
//     questionsSecondFetch!.edges![0].cursor
//   );
//   expect(questionsSecondFetch!.pageInfo.endCursor).toEqual(
//     questionsSecondFetch!.edges![0].cursor
//   );
//   expect(questionsSecondFetch!.pageInfo.hasNextPage).toEqual(false);
//   expect(questionsSecondFetch!.pageInfo.hasPreviousPage).toEqual(true);
//   done();
// });

// // tslint:disable-next-line: variable-name
// test("questions() should return total number of questions", async ____done____SERIOUSLY____DONE => {
//   const question = { _id: ObjectId(), tags: ["bla"], value: "questionValue" };
//   const question1 = {
//     _id: ObjectId(),
//     tags: ["bla", "shegichka_we_bonak_hihi"],
//     value: "questionValue1"
//   };
//   await new models.question(question).save();
//   await new models.question(question1).save();
//   await new models.user(contextUser).save();

//   if (typeof Query.questions !== "function") {
//     throw Error(`questions must be a function`);
//   }

//   const questionsFirstFetch = await Query.questions(
//     {} as any,
//     {
//       userId: contextUser._id.toHexString(),
//       answered: false,
//       first: 5
//     },
//     context,
//     {} as any
//   );

//   const questionsSecondFetch = await Query.questions(
//     {} as any,
//     {
//       userId: contextUser._id.toHexString(),
//       answered: false,
//       first: 5,
//       after: questionsFirstFetch!.pageInfo.startCursor
//     },
//     context,
//     {} as any
//   );
//   const actual = questionsSecondFetch!.edges!.length;
//   const expected = 1;
//   expect(actual).toEqual(expected);
//   ____done____SERIOUSLY____DONE();
// });

test("questionsTags() should return all tags", async notDONEyet => {
  const question: DbTypes.Question = {
    _id: ObjectId(),
    tags: ["bla"],
    value: "questionValue"
  };
  const question1: DbTypes.Question = {
    _id: ObjectId(),
    tags: ["bla1", "shegichka_we_bonak_hihi"],
    value: "questionValue1"
  };
  await new models.question(question).save();
  await new models.question(question1).save();
  await new models.user(contextUser).save();

  if (typeof Query.questionsTags !== "function") {
    throw Error(`questionsTags must be a function`);
  }

  const allTags = await Query.questionsTags({} as any, {}, context, {} as any);
  // console.log(allTags);
  expect(allTags).toContain("bla");
  expect(allTags).toContain("bla1");
  expect(allTags).toContain("shegichka_we_bonak_hihi");
  notDONEyet();
});

test("answeredQuestion() should return answered question", async done => {
  const question: DbTypes.Question = {
    _id: ObjectId(),
    tags: ["bla"],
    value: "questionValue"
  };
  await new models.question(question).save();
  await new models.user(contextUser).save();
  const dbAnswerObj: DbTypes.Answer = {
    _id: ObjectId(),
    userId: contextUser._id.toHexString(),
    questionId: question._id.toHexString(),
    position: 1,
    editions: [{ _id: ObjectId(), date: new Date(), value: "answerValue" }]
  };
  const dbAnswer = (await new models.answer(dbAnswerObj).save()).toObject();

  if (typeof Query.answeredQuestion !== "function") {
    throw Error(`answeredQuestion must be a function`);
  }

  const answeredQuestion = await Query.answeredQuestion(
    {} as any,
    {
      questionId: question._id.toHexString(),
      userId: contextUser._id.toHexString()
    },
    context,
    {} as any
  );
  expect(answeredQuestion!.value).toEqual(question.value);
  expect(answeredQuestion!.answer!.editions[0].value).toEqual(
    dbAnswer.editions[0].value
  );
  done();
});

test("addQuestions() should add questions to db", async done => {
  if (typeof Mutation.addQuestions !== "function") {
    throw Error(`questions must be a function`);
  }
  await Mutation.addQuestions(
    {} as any,
    { questions: [{ tags: ["tag1"], value: "Question?" }] },
    context,
    {} as any
  );
  const dbQuestions = (await models.question.find()).map(q => q.toObject());
  const actual = dbQuestions[0];
  const expected: DbTypes.UnansweredQuestion = {
    _id: actual._id,
    tags: ["tag1"],
    value: "Question?"
  };
  expect(actual._id).toEqual(expected._id);
  expect(actual.tags).toEqual(expected.tags);
  expect(actual.value).toEqual(expected.value);
  done();
});
