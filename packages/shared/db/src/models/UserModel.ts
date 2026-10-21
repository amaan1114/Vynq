import ExpressCassandra from "express-cassandra";

export default {
  table_name: "users",

  fields: {
    // Object form lets you set a default; generated in Node so save() knows the id.
    user_id: { type: "uuid", default: () => ExpressCassandra.uuid() },
    name: "text",
    email: "text",
    password_hash: "text",
    is_verified: { type: "boolean", default: false },
    avatar_url: "text",
  },

  // Single column = partition key. Rows are looked up by user_id only.
  key: ["user_id"],

  // Secondary index so users can be looked up by email (sign-up / sign-in).
  indexes: ["email"],

  // Adds and maintains created_at / updated_at columns automatically.
  options: {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
};
