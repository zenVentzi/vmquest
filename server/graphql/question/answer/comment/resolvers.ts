import { ApolloContext } from "gqlContext";
import { mapComment, mapComments } from "./gqlMapper";
import { authMiddleware } from "../../../middlewares";

import { MutationResolvers } from "../../../autoGenTypes";

interface Mutation {
  commentAnswerEdition: MutationResolvers.CommentAnswerEditionResolver;
  editComment: MutationResolvers.EditCommentResolver;
  removeComment: MutationResolvers.RemoveCommentResolver;
}

const Mutation: Mutation = {
  async commentAnswerEdition(
    _,
    { answerId, answerEditionId, comment },
    { services, user }
  ) {
    authMiddleware(user);

    const dbAnswer = await services.answer.getAnswerById(answerId);
    const dbComment = await services.comment.commentAnswerEdition(
      user!.id,
      comment,
      answerId,
      answerEditionId
    );

    if (!dbComment) throw Error("Failed to add comment");

    await services.newsfeed.onNewComment(
      dbAnswer,
      dbComment._id.toString(),
      user!.id
    );
    await services.notification.newComment(user!.id, answerId, dbComment);

    return mapComment({
      dbComment,
      loggedUserId: user!.id
    });
  },

  async editComment(
    _,
    { answerId, answerEditionId, commentId, commentValue },
    { services, user }
  ) {
    authMiddleware(user);

    const dbComment = await services.comment.editComment(
      answerId,
      answerEditionId,
      commentId,
      commentValue
    );

    if (dbComment) {
      return mapComment({
        dbComment,
        loggedUserId: user!.id
      });
    }

    // this should happen inside the service
    throw Error("Failed to edit comment");
  },

  async removeComment(
    _,
    { answerId, answerEditionId, commentId },
    { services, user }
  ) {
    authMiddleware(user);

    const dbComment = await services.comment.removeComment(
      answerId,
      answerEditionId,
      commentId
    );
    return mapComment({
      dbComment,
      loggedUserId: user!.id
    });
  }
};

export { Mutation };
