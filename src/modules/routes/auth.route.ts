import { AuthController } from "@controllers/auth.controller";
import { AuthRepository, IAuthRepository } from "@repositories/auth.repository";
import { IUserRepository, UserRepository } from "@repositories/user.repository";
import { AuthLoginSchema, AuthRegisterSchema } from "@schemas/auth.schema";
import { CatchAsync } from "@utils/catch-async.utils";
import { Router } from "express";
import { ValidateSchema } from "modules/middlewares/validate-schema.middleware";
import { AssignRoles } from "modules/middlewares/assign-role.middleware";
import { VerifyToken } from "modules/middlewares/verify-token.middleware";
import { AuthService, IAuthService } from "modules/services/auth.service";
import { IUserService, UserService } from "modules/services/user.service";


// ===== Dependency Injections =====
const authRepository: IAuthRepository = new AuthRepository();
const authService: IAuthService = new AuthService(authRepository);
// 
const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);
const authController = new AuthController(authService, userService);
// ================================

const authRouter: Router = Router();

authRouter.post(
    "/register",
    ValidateSchema(AuthRegisterSchema),
    AssignRoles, // defaulting [´guest´]
    CatchAsync(authController.register),
);

authRouter.post(
    "/login",
    ValidateSchema(AuthLoginSchema),
    CatchAsync(authController.login),
);

authRouter.post("/logout", VerifyToken, CatchAsync(authController.logout));

export default authRouter;
