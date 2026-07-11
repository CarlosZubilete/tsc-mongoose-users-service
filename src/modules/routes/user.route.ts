import { Router } from "express";
import { IUserRepository, UserRepository } from "@repositories/user.repository";
import { IUserService, UserService } from "modules/services/user.service";
import { UserController } from "@controllers/user.controller";
import { CatchAsync } from "@utils/catch-async.utils";
import { ValidateSchema } from "modules/middlewares/validate-schema.middleware";
import { CreateUserSchema, UpdateUserSchema } from "@schemas/user.schema";

// Dependency injection 
const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);
const userController = new UserController(userService);

const userRouter: Router = Router();

userRouter.get("/", CatchAsync(userController.getList));

userRouter.get("/:id", CatchAsync(userController.getById));

userRouter.post(
    "/",
    ValidateSchema(CreateUserSchema),
    CatchAsync(userController.create),
);

userRouter.put(
    "/:id",
    ValidateSchema(UpdateUserSchema),
    CatchAsync(userController.update),
);

userRouter.delete("/:id", CatchAsync(userController.deleteById));

export default userRouter;
