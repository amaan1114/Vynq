import ExpressCassandra from "express-cassandra";

export default {
  table_name: "private_conversations",

  fields: {
    pair_key: "text",

    conversation_id: {
      type: "uuid",
      default: () => ExpressCassandra.uuid(),
    },

    user_a_id: "uuid",
    user_b_id: "uuid",

    created_at: {
      type: "timestamp",
      default: Date.now,
    },
  },

  key: ["pair_key"],
};