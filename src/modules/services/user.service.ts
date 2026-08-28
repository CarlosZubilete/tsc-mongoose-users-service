import { AuthLogin } from "@models/auth.model";
import { UserResponse, UserCreate, UserUpdate, User } from "@models/user.model";
import { IUserRepository } from "@repositories/user.repository";
import { comparePassword, hashPassword } from "@utils/bcrypt";
import { UserMapper } from "@mappers/user.mapper";
import { NotFoundError } from "@errors/not-found-error";
import { ConflictError } from "@errors/conflict-error";
import { RoleResponse } from "@models/role.model";
import { ForbiddenError } from "@errors/forbidden-error";
import { IRoleService } from "./role.service";

interface IUserService {
    findUsers(): Promise<UserResponse[]>;
    findUserById(id: string): Promise<UserResponse | null>;
    createUser(dto: UserCreate): Promise<UserResponse | null>;
    updateUser(
        id: string,
        dto: UserUpdate,
        loggedInUserRoles: RoleResponse[],
        loggedInUserId: string,
    ): Promise<UserResponse | null>;
    deleteUser(
        id: string,
        loggedInUserRoles: RoleResponse[],
        loggedInUserId: string,
    ): Promise<boolean>;
    isValidCredentials(authLogin: AuthLogin): Promise<boolean>;
    // return an object
    findUserByEmail(email: string): Promise<UserResponse | null>;
}

class UserService implements IUserService {
    private repository: IUserRepository;
    private roleService: IRoleService;

    constructor(userRepository: IUserRepository, roleService: IRoleService) {
        this.repository = userRepository;
        this.roleService = roleService;
    }

    async findUsers(): Promise<UserResponse[]> {
        const users = await this.repository.findAll();
        return UserMapper.toDTOList(users);
    }

    async findUserById(id: string): Promise<UserResponse | null> {
        const existsUser = await this.repository.findById(id);

        if (!existsUser)
            throw new NotFoundError(`User with this id: ${id} not found.`);

        return existsUser ? UserMapper.toDTO(existsUser) : null;
    }

    async createUser(dto: UserCreate): Promise<UserResponse | null> {
        // Check if the name exists
        if (await this.repository.existsBy({ name: dto.name }))
            throw new ConflictError(
                `User with this name: ${dto.name} already exists.`,
            );

        // Check if the username exists
        if (await this.repository.existsBy({ username: dto.username }))
            throw new ConflictError(
                `User with this username: ${dto.username} already exists.`,
            );

        // Check if email exists
        if (await this.repository.existsBy({ email: dto.email }))
            throw new ConflictError(
                `User with this email: ${dto.email} already exists.`,
            );

        const hashingPassword = await hashPassword(dto.password);
        dto.password = hashingPassword;

        const userCrated = await this.repository.create(dto);
        return userCrated ? UserMapper.toDTO(userCrated) : null;
    }

    async updateUser(
        id: string,
        dto: UserUpdate,
        loggedInUserRoles: RoleResponse[],
        loggedInUserId: string,
    ): Promise<UserResponse | null> {
        // Check if the user exists
        const existingUser = await this.repository.findById(id);
        if (!existingUser)
            throw new NotFoundError(`User with this id: ${id} not found.`);

        // If a standard user
        const isStandardUser = loggedInUserRoles.some(
            (rol) => rol.name === "user",
        );

        // If a standard user, it's just changed its own profile
        if (isStandardUser) {
            if (id !== loggedInUserId)
                throw new ForbiddenError(
                    `You do not have permission to change someone else's profile.`,
                );
        }

        // If the its own profile , it can make changes.
        // If not, we're looking their permission and comparing the level

        let canMakeChanges = false;

        // It's owner of the profile. (User - Manager - Admin , etc)
        if (existingUser.id === loggedInUserId) {
            canMakeChanges = true;
        } else {
            if (await this.hasEnoughLevel(existingUser, loggedInUserRoles))
                canMakeChanges = true;
        }

        // Throw the exception
        if (!canMakeChanges)
            throw new ForbiddenError(
                `Privilege Escalation Blocked: You don't have enough permissions to update this user.`,
            );

        // If wants to update the password: [USER - MANAGER - ADMIN]
        // todo: move a special endpoint.
        if (dto.newPassword) {
            // Who is changing the password ?
            // SCENARIO B: The user is updating their OWN password
            if (existingUser.id === loggedInUserId) {
                // If the own user wants to update its password
                if (!dto.password)
                    throw new ForbiddenError(
                        `Current password is required to update a new password`,
                    );

                // So, let's verify password
                const matchPassword = await comparePassword(
                    dto.password,
                    existingUser.password,
                );

                // console.log(`Match password >> ${matchPassword}`);

                if (!matchPassword)
                    throw new ForbiddenError(
                        `Password or email are not corrects.`,
                    );
            }

            // SCENARIO B: An admin is updating someone else's password.
            // We already confirmed 'canMakeChanges' is true earlier in your code.

            const hashingPassword = await hashPassword(dto.newPassword!);
            dto.password = hashingPassword;
        } else {
            // SECURITY: Ensure raw 'password' field sent in payload is stripped out
            delete dto.password;
        }

        // Check if the username already exists
        if (dto.name) {
            const name = dto.name;
            if (await this.repository.existsBy({ name: name }))
                throw new ConflictError(
                    `User with this name: ${name} already exists.`,
                );
        }
        // Check if the username already exists
        if (dto.username) {
            const username = dto.username;
            if (
                await this.repository.existsBy({
                    username: username,
                })
            )
                throw new ConflictError(
                    `User with this username: ${username} already exists.`,
                );
        }

        // Check if the email already exists
        if (dto.email) {
            const email = dto.email;
            if (
                await this.repository.existsBy({
                    email: email,
                })
            )
                throw new ConflictError(
                    `User with this email: ${email} already exists.`,
                );
        }

        // Remove helper DTO fields before updating the DB
        const user = await this.repository.update(id, dto);

        return user ? UserMapper.toDTO(user) : null;
    }

    async deleteUser(
        id: string,
        loggedInUserRoles: RoleResponse[],
        loggedInUserId: string,
    ): Promise<boolean> {
        const existingUser = await this.repository.findById(id);

        if (!existingUser)
            throw new NotFoundError(`User with id: ${id} not found. `);

        // Prevent self deleted
        if (existingUser.id === loggedInUserId)
            throw new ForbiddenError(
                `You cannot delete yourself. Please contact the administration.`,
            );

        // Permission level
        const canDelete = await this.hasEnoughLevel(
            existingUser,
            loggedInUserRoles,
        );

        if (!canDelete)
            throw new ForbiddenError(
                `Privilege Escalation Blocked: You don't have enough permissions to delete this user.`,
            );

        return this.repository.delete(id);
    }

    // Custom queries
    async isValidCredentials(authLogin: AuthLogin): Promise<boolean> {
        const existingUser = await this.repository.findBy({
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
        const existsUser = await this.repository.findBy({ email: email });
        return existsUser ? UserMapper.toDTO(existsUser) : null;
    }

    private async hasEnoughLevel(
        existingUser: User,
        loggedInUserRoles: RoleResponse[],
    ): Promise<boolean> {
        let canMakeChanges = false;

        // Extract the names roles of user form database
        const nameRolesByExistingUser = existingUser.roles.map(
            (role) => role.name,
        );

        // Get the roles list from existing user from the database
        const rolesByExistingUser = await this.roleService.findRolesByName(
            nameRolesByExistingUser,
        );

        //  Safely find the maximum levels using Math.max
        // If the array is empty, we default to 0 so it doesn't crash.
        const maxExistingUserLevel =
            rolesByExistingUser.length > 0
                ? Math.max(...rolesByExistingUser.map((r) => r.level))
                : 0;

        const maxLoggedInLevel =
            loggedInUserRoles.length > 0
                ? Math.max(...loggedInUserRoles.map((r) => r.level))
                : 0;

        if (maxLoggedInLevel > maxExistingUserLevel) canMakeChanges = true;

        return canMakeChanges;
    }
}

export { IUserService, UserService };
