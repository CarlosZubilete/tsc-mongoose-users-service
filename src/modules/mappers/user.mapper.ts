import { User, UserResponse } from "@models/user.model";
// import { hashPassword } from "@utils/bcrypt";

export class UserMapper {
    public static toDTO(user: User): UserResponse | null {
        if (!user) return null;

        return {
            id: user.id.toString(),
            email: user.email,
            username: user.username,
        };
    }

    public static toDTOList(users: User[]): UserResponse[] {
        return users
            .map((user) => this.toDTO(user))
            .filter((user) => user !== null); // as UserResponse[];
    }

    // public static async toEntity(dto: UserCreate): Promise<UserCreate | null> {
    //     if (!dto) return null;

    //     const hashingPassword = await hashPassword(dto.password);

    //     return {
    //         name: dto.username,
    //         username: dto.username,
    //         email: dto.email,
    //         password: hashingPassword,
    //     };
    // }
}
