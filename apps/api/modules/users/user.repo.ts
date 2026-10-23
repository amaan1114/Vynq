import { models } from "@repo/db/config/cassandra";
export const SearchingUsers = async (email: string) => {
    // Cassandra has no OR, and $like needs a SASI index (disabled by default in Cassandra 4.1),
    // so search is an exact match on the existing email index
    return models.instance.User.findAllAsync({ email }, { raw: true });
}
