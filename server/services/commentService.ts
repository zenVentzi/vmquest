import { Types as GooseTypes, model } from "mongoose";
import * as DbTypes from "../dbTypes";
// import * as GqlTypes from "../generated/gqltypes";
import { Models } from "../models";

const { ObjectId } = GooseTypes;

class CommentService {
  constructor(private models: Models) {}

  public async commentAnswerEdition(
    performerId: string,
    comment: string,
    answerId: string,
    answerEditionId: string
  ): Promise<DbTypes.Comment> {
    const performer = (await this.models.user.findById(
      performerId
    ))!.toObject();

    const answer = ((await this.models.answer.findById(
      answerId
    )) as unknown) as DbTypes.AnswerDoc<DbTypes.AnswerPopulatedFields.none>;

    if (!answer) {
      throw Error(`Could not find answer with id ${answerId}`);
    }

    const editionIndex = answer.editions.findIndex(ed =>
      ed._id.equals(answerEditionId)
    );

    let editionComments = answer.editions[editionIndex].comments;
    const addedComment: DbTypes.Comment<DbTypes.AnswerPopulatedFields.none> = {
      _id: ObjectId(),
      value: comment,
      user: performer!._id
    };

    if (!editionComments || !editionComments.length) {
      editionComments = [addedComment];
      answer.editions[editionIndex].comments = editionComments;
    } else {
      editionComments.push(addedComment);
    }

    await answer.save();

    const res: DbTypes.Comment = {
      _id: addedComment._id,
      value: addedComment.value,
      user: performer
    };

    return res;
  }

  public async editComment(
    answerId: string,
    answerEditionId: string,
    commentId: string,
    commentValue: string
  ): Promise<DbTypes.Comment> {
    const answer = await this.models.answer
      .findById(answerId)
      .populate(DbTypes.AnswerPopulatedFields.editions_comments_user)
      .populate(
        DbTypes.AnswerPopulatedFields.editions_comments_likes_likers_user
      );
    if (!answer) {
      throw Error(`Could not find answer with id ${answerId}`);
    }
    const edition = answer.editions.find(ed => ed._id.equals(answerEditionId));
    if (!edition) {
      throw Error(`Could not find edition with id ${answerEditionId}`);
    }

    let editedComment: DbTypes.Comment | undefined;

    if (!edition.comments || !edition.comments.length) {
      throw Error(`Edition with id ${answerEditionId} , has no comments`);
    } else {
      edition.comments.forEach(comment => {
        if (comment._id.equals(commentId)) {
          comment.value = commentValue;
          editedComment = comment;
        }
      });
      if (!editedComment) {
        throw Error(`Could not find comment with id ${commentId}`);
      }
      await answer.save();
      return editedComment;
    }
  }

  public async removeComment(
    answerId: string,
    answerEditionId: string,
    commentId: string
  ): Promise<DbTypes.Comment> {
    const answer = await this.models.answer
      .findById(answerId)
      .populate(DbTypes.AnswerPopulatedFields.editions_comments_user)
      .populate(
        DbTypes.AnswerPopulatedFields.editions_comments_likes_likers_user
      );

    if (!answer) {
      throw Error(`Could not find answer with id ${answerId}`);
    }
    const edition = answer.editions.find(ed => ed._id.equals(answerEditionId));
    if (!edition) {
      throw Error(
        `Could not find answer edition.
         AnswerId: ${answerId} EditionId: ${answerEditionId}`
      );
    }
    if (!edition.comments || !edition.comments.length) {
      throw Error(`Edition has no comments. EditionId: ${answerEditionId}`);
    }
    const deletedComment = edition.comments.find(com =>
      com._id.equals(commentId)
    );
    if (!deletedComment) {
      throw Error(`Could not find comment to delete. CommentId: ${commentId}`);
    }
    const updatedComments = edition.comments.filter(
      com => !com._id.equals(commentId)
    );
    edition.comments = updatedComments;
    await answer.save();
    return deletedComment;
  }

  /**
   * removeByUserId can be costly if there are thousands of answers and comments
   */
  public async onDeleteAccount(deletedUserId: string) {
    const allAnswers = ((await this.models.answer.find()) as any) as Array<
      DbTypes.AnswerDoc<DbTypes.AnswerPopulatedFields.none>
    >;

    for (let answerIndex = 0; answerIndex < allAnswers.length; answerIndex++) {
      const answer = allAnswers[answerIndex];
      for (
        let editionIndex = 0;
        editionIndex < answer.editions.length;
        editionIndex++
      ) {
        const edition = answer.editions[editionIndex];
        if (edition.comments) {
          for (
            let commentIndex = 0;
            commentIndex < edition.comments.length;
            commentIndex++
          ) {
            const commentForRemoval = edition.comments[commentIndex];

            if (deletedUserId === commentForRemoval.user.toHexString()) {
              answer.editions[editionIndex].comments! = answer.editions[
                editionIndex
              ].comments!.filter(c => !c._id.equals(commentForRemoval._id));
              await answer.save();
            }
          }
        }
      }
    }

    allAnswers.forEach(answer => {
      answer.editions.forEach(edition => {
        if (edition.comments) {
          edition.comments.forEach(comment => {});
        }
      });
    });
  }

  public async likeComment(
    answerId: string,
    answerEditionId: string,
    commentId: string,
    likerId: string,
    userLikes: number
  ): Promise<DbTypes.Comment> {
    const answer = await this.models.answer
      .findById(answerId)
      .populate(DbTypes.AnswerPopulatedFields.editions_comments_user)
      .populate(
        DbTypes.AnswerPopulatedFields.editions_comments_likes_likers_user
      );

    if (!answer) {
      throw Error(`Could not find answer with id ${answerId}`);
    }
    const edition = answer.editions.find(ed => ed._id.equals(answerEditionId));
    if (!edition) {
      throw Error(
        `Could not find answer edition.
         AnswerId: ${answerId} EditionId: ${answerEditionId}`
      );
    }
    if (!edition.comments || !edition.comments.length) {
      throw Error(`Edition has no comments. EditionId: ${answerEditionId}`);
    }
    const likedComment = edition.comments.find(com =>
      com._id.equals(commentId)
    );
    if (!likedComment) {
      throw Error(`Could not find liked comment with id: ${commentId}`);
    }
    const liker = await this.models.user.findById(likerId);
    if (!liker) {
      throw Error(`liker object not found`);
    }

    if (!likedComment.likes) {
      likedComment.likes = {
        total: userLikes,
        likers: [
          {
            numOfLikes: userLikes,
            user: liker.toObject()
          }
        ]
      };
    } else {
      let prevUserLikes = 0;
      likedComment.likes.likers.forEach(currentLiker => {
        if (currentLiker.user._id.equals(liker._id)) {
          prevUserLikes = currentLiker.numOfLikes;
          currentLiker.numOfLikes = userLikes;
        }
      });
      if (!prevUserLikes) {
        likedComment.likes.likers.push({
          numOfLikes: userLikes,
          user: liker.toObject()
        });
      }
      likedComment.likes.total =
        likedComment.likes.total - prevUserLikes + userLikes;
    }
    await answer.save();
    return likedComment;
  }
}

export { CommentService };
