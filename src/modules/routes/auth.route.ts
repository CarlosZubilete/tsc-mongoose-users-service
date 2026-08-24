import { AuthController } from "@controllers/auth.controller";
import { AuthRepository, IAuthRepository } from "@repositories/auth.repository";
import { IUserRepository, UserRepository } from "@repositories/user.repository";
import { AuthLoginSchema, AuthRegisterSchema } from "@schemas/auth.schema";
import { CatchAsync } from "@utils/catch-async.utils";
import { Router } from "express";
import { ValidateSchema } from "@middlewares/validate-schema.middleware";
import { AssignRoles } from "@middlewares/assign-role.middleware";
import { VerifyToken } from "@middlewares/verify-token.middleware";
import { AuthService, IAuthService } from "@services/auth.service";
import { IUserService, UserService } from "@services/user.service";
import { IRoleRepository, RoleRepository } from "@repositories/role.repository";
import { IRoleService, RoleService } from "@services/role.service";

// ===== Dependency Injections =====
const authRepository: IAuthRepository = new AuthRepository();
const authService: IAuthService = new AuthService(authRepository);

const roleRepository: IRoleRepository = new RoleRepository();
const roleService: IRoleService = new RoleService(roleRepository);

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository, roleService);

const authController = new AuthController(authService, userService);

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
