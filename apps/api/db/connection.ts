import { connectCassandra } from "@repo/db/config/cassandra";

export async function connectDB() {
    try {
        const message = await connectCassandra();
        console.log(message);
    } catch (err) {
        console.error("Cassandra connection failed:", err);
        process.exit(1);
    }
}
