import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "@utils/jwt";
import { AuthService, IAuthService } from "modules/services/auth.service";
import { AuthRepository, IAuthRepository } from "@repositories/auth.repository";
import { InvalidTokenError } from "@errors/invalid-token-error";
import { UserRepository } from "@repositories/user.repository";
import { IUserService, UserService } from "modules/services/user.service";
import { IRoleRepository, RoleRepository } from "@repositories/role.repository";
import { IRoleService, RoleService } from "modules/services/role.service";
import { AuthTokenPayload } from "@models/auth.model";

const authRepository: IAuthRepository = new AuthRepository();
const authService: IAuthService = new AuthService(authRepository);

const userRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

const roleRepository: IRoleRepository = new RoleRepository();
const roleService: IRoleService = new RoleService(roleRepository);

export const VerifyToken = async (
    req: Request,
    _: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;
        // Check if the header exists
        if (!authHeader) throw new InvalidTokenError("No token provided");

        // Get token from headers
        const token = req.headers.authorization
            ?.replace(/Bearer\s+/, "")
            .trim() as string;

        // 1.Verify with the secret key
        const payloadVerified = verifyJwt(token) as AuthTokenPayload;

        // 2. Verify is not expired in the database
        const userId = payloadVerified.sub as string;
        const isValidToken = await authService.isValidToken(token, userId);

        if (!isValidToken)
            throw new InvalidTokenError("Token was expired or invalid");

        // 3. Find the user.
        const user = await userService.findUserById(userId);
        if (!user)
            throw new InvalidTokenError(
                "User associated with this token no longer exists",
            );

        // 3. Find the User's roles.
        const userRoles = await roleService.findRoleByName(
            payloadVerified.roles,
        );

        if (userRoles.length === 0)
            throw new InvalidTokenError(
                "User Roles associated with this token no longer exists",
            );

        // Token verified and
        req.token_verified = token;
        req.user_logged = user;
        req.user_logged_roles = userRoles;

        next();
    } catch (error) {
        next(error);
    }
};
