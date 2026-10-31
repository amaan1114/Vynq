import { models } from "@repo/db/config/cassandra";
import HttpError from "./httpError.js";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// express-cassandra only accepts cassandra-driver Uuid objects for uuid columns (in queries and saves);
// a plain string, even a valid one, fails with "Invalid Value ... (Type: uuid)".
// Ids arrive as strings from the token, params and body, so repos convert them here
export const toUuid = (id: string) => {
    if (!UUID_PATTERN.test(id)) {
        throw new HttpError({ statusCode: 400, message: `Invalid id: ${id}` });
    }
    return models.uuidFromString(id);
}
