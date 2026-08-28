import { AuthLogin, AuthResponse } from "@models/auth.model";
import { IAuthRepository } from "@repositories/auth.repository";
import { signJwt } from "@utils/jwt";
import { AuthMapper } from "@mappers/auth.mapper";
import { IUserService } from "./user.service";
import { BadRequestError } from "@errors/bad-request-error";
import { NotFoundError } from "@errors/not-found-error";

interface IAuthService {
    login(login: AuthLogin): Promise<AuthResponse>;
    logout(token: string): Promise<boolean>;
    isValidToken(token: string, sub: string): Promise<boolean>;
}

class AuthService implements IAuthService {
    private repository: IAuthRepository;
    private userService: IUserService;

    constructor(authRepository: IAuthRepository, userService: IUserService) {
        this.repository = authRepository;
        this.userService = userService;
    }

    async login(login: AuthLogin): Promise<AuthResponse> {
        // Verify email and password
        const isCorrectsCredentials =
            await this.userService.isValidCredentials(login);

        if (!isCorrectsCredentials)
            throw new BadRequestError(`Email or password art not corrects.`);

        // find the user to sign the jwt

        const existingUser = await this.userService.findUserByEmail(
            login.email,
        );
        // We've checked before, so this is optional
        if (!existingUser)
            throw new NotFoundError(
                `User whit this email: ${login.email} not found.`,
            );

        // Sing the token
        const token = signJwt({
            sub: existingUser.id,
            email: existingUser.email,
            username: existingUser.username,
            roles: existingUser.roles,
        });
        // Parse to AuthCreate
        const auth = AuthMapper.toEntity(token, existingUser.id);
        // Save the token in the database
        const newAuth = await this.repository.create(auth);
        // Parse AuthResponse
        return AuthMapper.toDTO(existingUser, newAuth.token);
    }

    async logout(token: string): Promise<boolean> {
        const isDeleted = await this.repository.delete(token);

        if (!isDeleted)
            throw new BadRequestError(
                `That token has not found in the database.`,
            );

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
