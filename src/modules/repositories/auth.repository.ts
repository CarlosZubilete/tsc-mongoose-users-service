import { AuthenticationCollection } from "../collections/auth.collection";
import { AuthCreate, Authentication } from "@models/auth.model";

// key:value
type Filter = Record<string, unknown>;

interface IAuthRepository {
    create(auth: AuthCreate): Promise<Authentication>;
    delete(token: string): Promise<boolean>;
    existsBy(token: string, sub: string): Promise<boolean>;
}

class AuthRepository implements IAuthRepository {
    async create(auth: AuthCreate): Promise<Authentication> {
        const newAuth = new AuthenticationCollection(auth);
        return await newAuth.save();
    }

    // TODO: Do I need logic delete ?
    async delete(token: string): Promise<boolean> {
        const result = await AuthenticationCollection.deleteOne({
            token: token,
        }).exec();
        return result.deletedCount > 0;
    }

    async existsBy(token: string, sub: string): Promise<boolean> {
        const result = await AuthenticationCollection.exists({
            token: token,
            sub: sub,
            isValid: true,
        }).exec();
        return result !== null;
    }
}

export { IAuthRepository, AuthRepository };
