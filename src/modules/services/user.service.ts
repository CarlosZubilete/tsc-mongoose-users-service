import { User, UserCreate, UserUpdate, UserResponse } from "@models/user.model";
import { IUserRepository } from "@repositories/user.repository";

interface IUserService {
    findUsers(): Promise<UserResponse[]>;
    findUserById(id: string): Promise<UserResponse | null>;
    createUser(newUser: UserCreate): Promise<UserResponse | null>;
    updateUser(
        id: string,
        partialUser: UserUpdate,
    ): Promise<UserResponse | null>;
    deleteUser(id: string): Promise<Boolean>;
    // custom
    existsUserById(id: string): Promise<Boolean>;
    existsUserByName(name: string): Promise<Boolean>;
    existsUserByUserName(username: string): Promise<Boolean>;
    existsUserByEmail(email: string): Promise<Boolean>;
}

class UserService implements IUserService {
    private repository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.repository = userRepository;
    }

    async findUsers(): Promise<UserResponse[]> {
        return this.repository.findAll();
    }

    async findUserById(id: string): Promise<UserResponse | null> {
        return this.repository.findById(id);
    }

    async createUser(newUser: UserCreate): Promise<UserResponse | null> {
        return this.repository.create(newUser);
    }

    async updateUser(
        id: string,
        partialUser: UserUpdate,
    ): Promise<UserResponse | null> {
        return this.repository.update(id, partialUser);
    }

    async deleteUser(id: string): Promise<Boolean> {
        return this.repository.delete(id);
    }

    async existsUserById(id: string): Promise<Boolean> {
        return this.repository.existsBy({ _id: id });
    }

    async existsUserByName(name: string): Promise<Boolean> {
        return this.repository.existsBy({ name: name });
    }

    async existsUserByUserName(username: string): Promise<Boolean> {
        return this.repository.existsBy({ username: username });
    }

    async existsUserByEmail(email: string): Promise<Boolean> {
        return this.repository.existsBy({ email: email });
    }
}

export { IUserService, UserService };
