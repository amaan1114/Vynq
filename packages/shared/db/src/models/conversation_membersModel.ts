export default {
  table_name: "conversation_members",

  fields: {
    conversation_id: "uuid",
    user_id: "uuid",
    joined_at: { type: "timestamp", default: Date.now },
    role: { type: "text", default: "member" },
  },

  // Retrieve all members belonging to a conversation.
  key: [["conversation_id"], "user_id"],
};