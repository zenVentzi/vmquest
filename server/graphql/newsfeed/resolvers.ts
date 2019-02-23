import { Query } from "./types";
import { mapNewsfeed } from "./gqlMapper";
import { ApolloContext } from "gqlContext";

const NewsBase = {
  __resolveType(obj, context: ApolloContext, info) {
    switch (obj.type) {
      case "NEW_ANSWER":
      case "NEW_ANSWER_EDITION":
        return "AnswerNews";
      case "NEW_COMMENT":
        return "CommentNews";
      case "NEW_LIKE":
        return "NewLikeNews";
      case "NEW_FOLLOWER":
        return "NewFollowerNews";

      default:
        throw new Error(`${obj.type} is incorrect`);
    }
  }
};

const News = {
  __resolveType(obj, context, info) {
    switch (obj.type) {
      case "NEW_ANSWER":
      case "NEW_ANSWER_EDITION":
        return "AnswerNews";
      case "NEW_COMMENT":
        return "CommentNews";
      case "NEW_LIKE":
        return "NewLikeNews";
      case "NEW_FOLLOWER":
        return "NewFollowerNews";

      default:
        throw new Error(`${obj.type} is incorrect`);
    }
  }
};

const Query: Query = {
  async newsfeed(_, __, { services, user }) {
    const newsfeedDb = await services.newsfeed.getNewsfeed(user!.id);
    const newsfeedQuestions = await services.newsfeed.getNewsFeedQuestions(
      newsfeedDb
    );
    const newsfeedUsers = await services.newsfeed.getNewsFeedUsers(newsfeedDb);

    const gqlNewsfeed = mapNewsfeed(
      newsfeedDb,
      newsfeedUsers,
      newsfeedQuestions,
      user!.id
    );

    return gqlNewsfeed;
  }
};

export { NewsBase, News, Query };
