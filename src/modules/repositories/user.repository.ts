import { UserCreate, UserUpdate, UserResponse, User } from "@models/user.model";
import { UserCollection } from "modules/database/user.collection";
import { UserMapper } from "modules/mappers/user-mapper";

// key:value
type Filter = Record<string, unknown>;

interface IUserRepository {
    findAll(): Promise<UserResponse[]>;
    findById(id: string): Promise<UserResponse | null>;
    create(data: UserCreate): Promise<UserResponse | null>;
    update(id: string, data: UserUpdate): Promise<UserResponse | null>;
    delete(id: string): Promise<Boolean>;
    // Custom queries
    existsBy(filed: Filter): Promise<Boolean>;
}

class UserRepository implements IUserRepository {
    async findAll(): Promise<UserResponse[]> {
        const users = await UserCollection.find();
        return UserMapper.toDTOList(users);
    }

    async findById(id: string): Promise<UserResponse | null> {
        const user = await UserCollection.findById(id).exec();
        return user ? UserMapper.toDTO(user) : null;
    }

    async create(data: UserCreate): Promise<UserResponse | null> {
        const newUser = new UserCollection(data);
        await newUser.save();
        return UserMapper.toDTO(newUser);
    }

    async update(id: string, data: UserUpdate): Promise<UserResponse | null> {
        const updated = await UserCollection.findByIdAndUpdate(id, data, {
            new: true,
        }).exec();
        return updated ? UserMapper.toDTO(updated) : null;
    }

    async delete(id: string): Promise<Boolean> {
        const result = await UserCollection.findByIdAndDelete(id).exec();
        return result !== null;
    }

    // Custom queries:
    async existsBy(field: Filter): Promise<Boolean> {
        const exists = await UserCollection.exists(field).exec();
        return exists ? true : false;
    }
}

export { IUserRepository, UserRepository };