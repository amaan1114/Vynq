import { models } from "@repo/db/config/cassandra";
import { toUuid } from "../../utils/uuid.js";
export const SearchingUsers = async (email: string) => {
    // Cassandra has no OR, and $like needs a SASI index (disabled by default in Cassandra 4.1),
    // so search is an exact match on the existing email index
    // express-cassandra has find/findOne only; there is no findAll
    return models.instance.User.findAsync({ email }, { raw: true });
}

export const getUserById = async (userId: string) => {
    // user_id is the partition key; findOneAsync resolves to undefined when no row matches
    return models.instance.User.findOneAsync({ user_id: toUuid(userId) }, { raw: true });
}
