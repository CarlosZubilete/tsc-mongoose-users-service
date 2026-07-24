import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "@utils/jwt";
import { InternalServerError } from "@errors/internal-server-error";
import { AuthService, IAuthService } from "modules/services/auth.service";
import { AuthRepository, IAuthRepository } from "@repositories/auth.repository";
import { InvalidTokenError } from "@errors/invalid-token-error";

const authRepository: IAuthRepository = new AuthRepository();
const authService: IAuthService = new AuthService(authRepository);

export const VerifyToken = async (
    req: Request,
    _: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;

        // console.log(authHeader);
        // Check if the header exists
        if (!authHeader) throw new InvalidTokenError("No token provided");

        // Get token from headers
        const token = req.headers.authorization
            ?.replace(/Bearer\s+/, "")
            .trim() as string;
        // TODO: Do I need validated the payload ?

        // Verify with the secret key
        const payloadVerified = verifyJwt(token);

        // Verify is not expired in the database
        const userId = payloadVerified.sub as string;
        const isValidToken = await authService.isValidToken(token, userId);

        if (!isValidToken)
            throw new InvalidTokenError("Token was expired or invalid");

        // Token verified
        req.token_verified = token;
        req.user_id = userId;

        next();
    } catch (error) {
        if (error instanceof InvalidTokenError) {
            return next(error);
        }
        // show the error
        console.error("Token verification error: ", error);
        return next(new InvalidTokenError("Token verification failed"));
    }
};
