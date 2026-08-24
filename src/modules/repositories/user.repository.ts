import { User, UserCreate, UserUpdate } from "@models/user.model";
import { UserCollection } from "../collections/user.collection";

// key:value
type Filter = Record<string, unknown>;

interface IUserRepository {
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    create(newUser: UserCreate): Promise<User>;
    update(id: string, partialUser: UserUpdate): Promise<User | null>;
    delete(id: string): Promise<boolean>;
    // Custom queries
    findBy(field: Filter): Promise<User | null>;
    existsBy(field: Filter): Promise<boolean>;
}

class UserRepository implements IUserRepository {
    async findAll(): Promise<User[]> {
        return await UserCollection.find().populate("roles").exec();
    }

    async findById(id: string): Promise<User | null> {
        return await UserCollection.findById(id).populate("roles").exec();
    }

    async create(newUser: UserCreate): Promise<User> {
        const created = new UserCollection(newUser);
        return (await created.save()).populate("roles");
    }

    async update(id: string, user: UserUpdate): Promise<User | null> {
        return await UserCollection.findByIdAndUpdate(id, user, {
            returnDocument: "after",
        })
            .populate("roles")
            .exec();
    }

    async delete(id: string): Promise<boolean> {
        const result = await UserCollection.findByIdAndDelete(id).exec();
        return result !== null;
    }

    // Custom queries:
    async findBy(field: Filter): Promise<User | null> {
        return await UserCollection.findOne(field).populate("roles").exec();
    }

    async existsBy(field: Filter): Promise<boolean> {
        return !!(await UserCollection.exists(field).exec());
    }
}

export { IUserRepository, UserRepository };
