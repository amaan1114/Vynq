import ExpressCassandra from "express-cassandra";

export default {
  table_name: "messages_by_conversation",

  fields: {
    conversation_id: "uuid",
    message_id: {
      type: "timeuuid",
      default: () => ExpressCassandra.uuid(),
    },
    sender_id: "uuid",
    content: "text",
    message_type: { type: "text", default: "text" },
    created_at: { type: "timestamp", default: Date.now },
  },

  // Partition by conversation; cluster messages by their timeuuid.
  key: [["conversation_id"], "message_id"],

  clustering_order: {
    message_id: "desc",
  },
};