import { User, UserCreate, UserUpdate, UserResponse } from "@models/user.model";
import { IUserRepository } from "@repositories/user.repository";

interface IUserService {
    findUsers(): Promise<UserResponse[]>;
    findUserById(id: string): Promise<UserResponse | null>;
    createUser(data: UserCreate): Promise<UserResponse | null>;
    updateUser(id: string, data: UserUpdate): Promise<UserResponse | null>;
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

    async createUser(data: UserCreate): Promise<UserResponse | null> {
        return this.repository.create(data);
    }

    async updateUser(
        id: string,
        data: Partial<User>,
    ): Promise<UserResponse | null> {
        return this.repository.update(id, data);
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

/*
    async existsUserByName(name: string): Promise<Boolean> {
        return this.repository.existsByName(name);
    }

    async existsUserByUserName(username: string): Promise<Boolean> {
        return this.repository.existsByUserName(username);
    }

    async existsUserByEmail(email: string): Promise<Boolean> {
        return this.repository.existsByEmail(email);
    }
*/