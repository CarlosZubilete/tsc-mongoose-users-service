import { AuthResponse } from "@models/auth.model";
import { UserResponse } from "@models/user.model";
import { IAuthRepository } from "@repositories/auth.repository";
import { signJwt } from "@utils/jwt";
import { AuthMapper } from "modules/mappers/auth.mapper";


interface IAuthService {
    login(user: UserResponse): Promise<AuthResponse>;
    logout(token: string): Promise<boolean>;
    isValidToken(token: string, sub: string): Promise<boolean>;
}

class AuthService implements IAuthService {
    private repository: IAuthRepository;

    constructor(authRepository: IAuthRepository) {
        this.repository = authRepository;
    }

    async login(user: UserResponse): Promise<AuthResponse> {
        // Sing the token
        const token = signJwt({
            sub: user.id,
            email: user.email,
            username: user.username,
            roles: user.roles,
        });
        // Parse to AuthCreate
        const auth = AuthMapper.toEntity(token, user.id);
        // Save the token in the database
        const newAuth = await this.repository.create(auth);
        // Parse AuthResponse
        return AuthMapper.toDTO(user, newAuth.token);
    }

    async logout(token: string): Promise<boolean> {
        const isDeleted = await this.repository.delete(token);
        return isDeleted ? true : false;
    }

    async isValidToken(token: string, sub: string): Promise<boolean> {
        // valid token
        const result = await this.repository.existsBy(token, sub);

        // console.log("================== isValidToken =========== ", result);
        return result;
    }
}

export { IAuthService, AuthService };
