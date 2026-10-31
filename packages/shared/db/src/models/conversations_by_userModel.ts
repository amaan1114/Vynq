import ExpressCassandra from "express-cassandra";

export default {
  table_name: "conversations_by_user",

  fields: {
    user_id: "uuid",
    conversation_id: "uuid",
    other_user_id: "uuid",
    conversation_name: "text",
    last_message: "text",
    last_message_at: "timestamp",
    created_at: { type: "timestamp", default: Date.now },
  },

  // Each user's conversations, sorted by recent activity.
  key: [["user_id"], "last_message_at", "conversation_id"],

  clustering_order: {
    last_message_at: "desc",
    conversation_id: "asc",
  },
};