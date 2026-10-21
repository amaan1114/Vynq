import models from "express-cassandra";
import { fileURLToPath } from "node:url";

const modelsDir = fileURLToPath(new URL("../models", import.meta.url));

export function connectCassandra(): Promise<string> {
  return new Promise((resolve, reject) => {
    models.setDirectory(modelsDir).bind(
      {
        clientOptions: {
          contactPoints: (process.env.CASSANDRA_CONTACT_POINTS ?? "127.0.0.1").split(","),
          localDataCenter: process.env.CASSANDRA_DC ?? "datacenter1",
          protocolOptions: { port: Number(process.env.CASSANDRA_PORT ?? 9042) },
          keyspace: process.env.CASSANDRA_KEYSPACE ?? "chat_app",
          queryOptions: { consistency: models.consistencies.localQuorum },
          authProvider: new models.driver.auth.PlainTextAuthProvider(
            process.env.CASSANDRA_USER ?? "cassandra",
            process.env.CASSANDRA_PASSWORD ?? "",
          ),
          socketOptions: { readTimeout: 60000 },
        },
        ormOptions: {
          defaultReplicationStrategy: {
            class: "NetworkTopologyStrategy",
            datacenter1: 3,
          },
          migration: "safe",
        },
      },
      (err) => (err ? reject(err) : resolve('Data base connected successfully!')),
    );
  });
}

export { models };
