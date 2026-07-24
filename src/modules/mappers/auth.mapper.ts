import { AuthResponse, AuthCreate } from "@models/auth.model";
import { UserResponse } from "@models/user.model";

export class AuthMapper {
    public static toDTO(user: UserResponse, token: string): AuthResponse {
        // todo: I do not if the userdata has to be in token ?
        return {
            // sub: user.id,
            // username: user.username,
            // email: user.email,
            token: token,
        };
    }

    public static toEntity(token: string, idUser: string): AuthCreate {
        return {
            sub: idUser,
            token: token,
            isValid: true,
        };
    }
}
