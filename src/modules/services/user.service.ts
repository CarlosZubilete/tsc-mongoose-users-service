import { AuthLogin } from "@models/auth.model";
import { UserResponse, UserCreate, UserUpdate } from "@models/user.model";
import { IUserRepository } from "@repositories/user.repository";
import { comparePassword, hashPassword } from "@utils/bcrypt";
import { UserMapper } from "modules/mappers/user.mapper";

interface IUserService {
    findUsers(): Promise<UserResponse[]>;
    findUserById(id: string): Promise<UserResponse | null>;
    createUser(newUser: UserCreate): Promise<UserResponse | null>;
    updateUser(
        id: string,
        partialUser: UserUpdate,
    ): Promise<UserResponse | null>;
    deleteUser(id: string): Promise<boolean>;
    //
    isValidUser(authLogin: AuthLogin): Promise<boolean>;
    // return an object
    findUserByEmail(email: string): Promise<UserResponse | null>;
    // return a boolean
    existsUserById(id: string): Promise<boolean>;
    existsUserByName(name: string): Promise<boolean>;
    existsUserByUserName(username: string): Promise<boolean>;
    existsUserByEmail(email: string): Promise<boolean>;
}

class UserService implements IUserService {
    private repository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.repository = userRepository;
    }

    async findUsers(): Promise<UserResponse[]> {
        const users = await this.repository.findAll();
        return UserMapper.toDTOList(users);
    }

    async findUserById(id: string): Promise<UserResponse | null> {
        const existsUser = await this.repository.findById(id);
        return existsUser ? UserMapper.toDTO(existsUser) : null;
    }

    async createUser(newUser: UserCreate): Promise<UserResponse | null> {
        const hashingPassword = await hashPassword(newUser.password);
        newUser.password = hashingPassword;

        const userCrated = await this.repository.create(newUser);
        return userCrated ? UserMapper.toDTO(userCrated) : null;
    }

    async updateUser(
        id: string,
        partialUser: UserUpdate,
    ): Promise<UserResponse | null> {

        // todo: verify the permissions. It's only when the user is login.
        // let hashingPassword: string;
        // if (!partialUser.password) {
        //     hashingPassword = await hashPassword(
        //         partialUser.password as string,
        //     );
        //     partialUser.password = hashingPassword;
        // }

        const user = await this.repository.update(id, partialUser);
        return user ? UserMapper.toDTO(user) : null;
    }

    async deleteUser(id: string): Promise<boolean> {
        return this.repository.delete(id);
    }

    // Custom queries
    async isValidUser(authLogin: AuthLogin): Promise<boolean> {
        const existingUser = await this.repository.findOne({
            email: authLogin.email,
        });

        if (!existingUser) return false;

        const isRightPassword = await comparePassword(
            authLogin.password,
            existingUser.password,
        );

        if (!isRightPassword) return false;

        return true;
    }

    async findUserByEmail(email: string): Promise<UserResponse | null> {
        const existUser = await this.repository.findOne({ email: email });
        return existUser ? UserMapper.toDTO(existUser) : null;
    }

    async existsUserById(id: string): Promise<boolean> {
        return this.repository.existsBy({ _id: id });
    }

    async existsUserByName(name: string): Promise<boolean> {
        return this.repository.existsBy({ name: name });
    }

    async existsUserByUserName(username: string): Promise<boolean> {
        return this.repository.existsBy({ username: username });
    }

    async existsUserByEmail(email: string): Promise<boolean> {
        return this.repository.existsBy({ email: email });
    }
}

export { IUserService, UserService };
