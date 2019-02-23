import { Notification, NewComment } from "./types";
import {
  Notification as DbNotification,
  NotificationType,
  NewComment as DbNewComment
} from "../../dbTypes";

function mapNotification(notif: DbNotification): Notification {
  const res: Notification = {
    id: notif._id.toString(),
    type: notif.type,
    performerId: notif.performerId,
    performerAvatarSrc: notif.performerAvatarSrc,
    text: notif.text,
    seen: notif.seen,
    createdOn: notif._id.getTimestamp()
  };

  switch (notif.type) {
    case NotificationType.NewComment:
      (res as NewComment).questionId = (notif as DbNewComment).questionId;
      (res as NewComment).commentId = (notif as DbNewComment).commentId;
      break;

    default:
      break;
  }

  return res;
}

function mapNotifications(
  notifs: DbNotification[] | null
): Notification[] | null {
  if (!notifs || !notifs.length) return null;
  return notifs.map(mapNotification);
  // const arr: Array<DbNewComment | DbNewFollower> = [];
  // return arr;
}

export { mapNotification, mapNotifications };