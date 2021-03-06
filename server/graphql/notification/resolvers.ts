import { withFilter } from "apollo-server";
import { pubsub, NEW_NOTIFICATION } from "../../PubSub";

import {
  QueryResolvers,
  MutationResolvers,
  SubscriptionResolvers,
  NotificationResolvers,
  Notification,
  NotificationType
} from "../autoGenTypes";
import { mapNotifications } from "./gqlMapper";
import { authMiddleware } from "../middlewares";

const Notification: NotificationResolvers = {
  __resolveType(obj, context, info) {
    authMiddleware(context.user);

    switch (obj.type) {
      case NotificationType.NewComment:
      case NotificationType.CommentMention:
        return "NewComment";
      case NotificationType.NewFollower:
        return "NewFollower";
      case NotificationType.AnswerEditionMention:
        return "AnswerEditionMention";
      case NotificationType.AnswerEditionLike:
        return "AnswerEditionLike";
      case NotificationType.CommentLike:
        return "CommentLike";
    }

    throw Error(`unknown type, ${obj.type}`);
  }
};

type Query = Required<Pick<QueryResolvers, "notifications">>;
type Mutation = Required<Pick<MutationResolvers, "notifsMarkSeen">>;
// type Subscription = SubscriptionResolvers["newNotification"];
type Subscription = Required<Pick<SubscriptionResolvers, "newNotification">>;

const Query: Query = {
  async notifications(_, __, { services, user }) {
    authMiddleware(user);

    const dbNotifications = await services.notification.getNotifications(
      user!.id
    );

    const gqlNotifications = mapNotifications(dbNotifications);
    return gqlNotifications;
  }
};

const Mutation: Mutation = {
  async notifsMarkSeen(_, __, { services, user }) {
    authMiddleware(user);

    await services.notification.markSeen(user!.id);
    return true; // fix: remove that
  }
};

// fix the type
const Subscription: Subscription = {
  newNotification: {
    resolve: payload => {
      return payload.newNotification;
    },
    subscribe: withFilter(
      (_, __, context) => {
        authMiddleware(context.user);

        return pubsub.asyncIterator(NEW_NOTIFICATION);
      },
      (payload, variables) => {
        const subscriberId = variables.userId;
        if (payload.receiverId) {
          return payload.receiverId === subscriberId;
        } else if (payload.receiversIds) {
          return payload.receiversIds.includes(subscriberId);
        }

        throw Error(
          `incorrect format. Payload must have either receiverId or receiverIds`
        );
      }
    )
  }
};

export { Notification, Query, Mutation, Subscription };
