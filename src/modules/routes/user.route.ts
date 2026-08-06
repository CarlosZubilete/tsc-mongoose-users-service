import { Router } from "express";
import { IUserRepository, UserRepository } from "@repositories/user.repository";
import { IUserService, UserService } from "modules/services/user.service";
import { UserController } from "@controllers/user.controller";
import { CatchAsync } from "@utils/catch-async.utils";
import { ValidateSchema } from "modules/middlewares/validate-schema.middleware";
import { CreateUserSchema, UpdateUserSchema } from "@schemas/user.schema";
import { AssignRoles } from "modules/middlewares/assign-role.middleware";
import { VerifyPermissions } from "modules/middlewares/verify-permissions.middleware";
import { VerifyToken } from "modules/middlewares/verify-token.middleware";

// Dependency injection
const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);
const userController = new UserController(userService);

const userRouter: Router = Router();

// todo: add verify-token

userRouter.get(
    "/",
    VerifyToken,
    VerifyPermissions,
    CatchAsync(userController.getList),
);

userRouter.get(
    "/:id",
    VerifyToken,
    VerifyPermissions,
    CatchAsync(userController.getById),
);

userRouter.post(
    "/",
    ValidateSchema(CreateUserSchema),
    VerifyToken,
    VerifyPermissions,
    AssignRoles,
    CatchAsync(userController.create),
);

userRouter.put(
    "/:id",
    ValidateSchema(UpdateUserSchema),
    VerifyToken,
    VerifyPermissions,
    AssignRoles,
    CatchAsync(userController.update),
);

userRouter.delete(
    "/:id",
    VerifyToken,
    VerifyPermissions,
    CatchAsync(userController.deleteById),
);

export default userRouter;
