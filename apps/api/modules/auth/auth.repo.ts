import { models } from "@repo/db/config/cassandra";
import type { types } from "cassandra-driver";

export const getUserByEmail = async(email:string)=>{
    // Querying a non-key column needs the email index on UserModel; raw: true returns a plain object instead of a model instance
    // findOneAsync resolves to undefined when no row matches
    return models.instance.User.findOneAsync({ email }, { raw: true });
}

export const markUserAsVerified = async(userId:types.Uuid)=>{
    // updateAsync(where, set) runs UPDATE users SET is_verified = true WHERE user_id = ?
    // Cassandra only updates by full primary key, so the where part must be user_id (not email)
    await models.instance.User.updateAsync({ user_id: userId }, { is_verified: true });
}

export const addUser = async(userData:{email:string, password:string, name?:string})=>{
    // UserModel.ts is registered as models.instance.User; is_verified and timestamps come from the model defaults
    // user_id is set here because express-cassandra only applies defaults inside the INSERT and never writes them back,
    // so user.user_id would still be undefined after saveAsync()
    const user = new models.instance.User({
        user_id: models.uuid(),
        email: userData.email,
        name: userData.name,
        password_hash: userData.password,
    });
    // saveAsync is the promise version of save(); it runs an INSERT INTO users (...)
    await user.saveAsync();
    return user;
}

