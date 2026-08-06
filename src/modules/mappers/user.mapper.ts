import { User, UserResponse } from "@models/user.model";
// import { hashPassword } from "@utils/bcrypt";

export class UserMapper {
    public static toDTO(user: User): UserResponse | null {
        if (!user) return null;

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            roles: user.roles.map((role) => role.name),
            // permissions: user.permissions,
        };
    }

    public static toDTOList(users: User[]): UserResponse[] {
        return users
            .map((user) => this.toDTO(user))
            .filter((user) => user !== null); // as UserResponse[];
    }
}
