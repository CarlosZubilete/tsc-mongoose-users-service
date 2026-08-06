import { RoleController } from "@controllers/role.controller";
import { IRoleRepository, RoleRepository } from "@repositories/role.repository";
import { CreateRoleSchema, UpdateRoleSchema } from "@schemas/role.schema";
import { CatchAsync } from "@utils/catch-async.utils";
import { Router } from "express";
import { ValidateSchema } from "modules/middlewares/validate-schema.middleware";
import { VerifyPermissions } from "modules/middlewares/verify-permissions.middleware";
import { VerifyToken } from "modules/middlewares/verify-token.middleware";
import { IRoleService, RoleService } from "modules/services/role.service";

// Dependency injection
const roleRepository: IRoleRepository = new RoleRepository();
const roleService: IRoleService = new RoleService(roleRepository);
const roleController = new RoleController(roleService);

const roleRouter: Router = Router();

// User and guest don't allow access to these endpoints.
// Manager just could see them.
// It's just handle for 'admin' and root role.

roleRouter.get(
    "/",
    VerifyToken,
    VerifyPermissions,
    CatchAsync(roleController.getList),
);

roleRouter.get(
    "/:id",
    VerifyToken,
    VerifyPermissions,
    CatchAsync(roleController.getById),
);

roleRouter.post(
    "/",
    VerifyToken,
    VerifyPermissions,
    ValidateSchema(CreateRoleSchema),
    CatchAsync(roleController.create),
);

roleRouter.put(
    "/:id",
    VerifyToken,
    VerifyPermissions,
    ValidateSchema(UpdateRoleSchema),
    CatchAsync(roleController.update),
);

roleRouter.delete(
    "/:id",
    VerifyToken,
    VerifyPermissions,
    CatchAsync(roleController.delete),
);

export default roleRouter;
