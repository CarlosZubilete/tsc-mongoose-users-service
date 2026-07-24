import { User, UserCreate, UserUpdate } from "@models/user.model";
import { UserCollection } from "modules/database/user.collection";

// key:value
type Filter = Record<string, unknown>;

interface IUserRepository {
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    create(newUser: UserCreate): Promise<User>;
    update(id: string, partialUser: UserUpdate): Promise<User | null>;
    delete(id: string): Promise<boolean>;
    // Custom queries
    findOne(field: Filter): Promise<User | null>;
    existsBy(field: Filter): Promise<boolean>;
}

class UserRepository implements IUserRepository {
    async findAll(): Promise<User[]> {
        return await UserCollection.find();
    }

    async findById(id: string): Promise<User | null> {
        return await UserCollection.findById(id).exec();
    }

    async create(newUser: UserCreate): Promise<User> {
        const created = new UserCollection(newUser);
        return await created.save();
    }

    async update(id: string, user: Partial<User>): Promise<User | null> {
        return await UserCollection.findByIdAndUpdate(id, user, {
            new: true,
        }).exec();
    }

    async delete(id: string): Promise<boolean> {
        const result = await UserCollection.findByIdAndDelete(id).exec();
        return result !== null;
    }

    async findOne(field: Filter): Promise<User | null> {
        return await UserCollection.findOne(field).exec();
    }

    // Custom queries:
    async existsBy(field: Filter): Promise<boolean> {
        const exists = await UserCollection.exists(field).exec();
        return exists ? true : false;
    }
}

export { IUserRepository, UserRepository };
