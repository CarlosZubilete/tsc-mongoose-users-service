import { RoleController } from "@controllers/role.controller";
import { IRoleRepository, RoleRepository } from "@repositories/role.repository";
import { CreateRoleSchema, UpdateRoleSchema } from "@schemas/role.schema";
import { CatchAsync } from "@utils/catch-async.utils";
import { Router } from "express";
import { ValidateSchema } from "modules/middlewares/validate-schema.middleware";
import { IRoleService, RoleService } from "modules/services/roles.service";

// Dependency injection
const roleRepository: IRoleRepository = new RoleRepository();
const roleService: IRoleService = new RoleService(roleRepository);
const roleController = new RoleController(roleService);

const roleRouter: Router = Router();

roleRouter.get("/", CatchAsync(roleController.getList));

roleRouter.get("/:id", CatchAsync(roleController.getById));

roleRouter.post(
    "/",
    ValidateSchema(CreateRoleSchema),
    CatchAsync(roleController.create),
);

roleRouter.put(
    "/:id",
    ValidateSchema(UpdateRoleSchema),
    CatchAsync(roleController.update),
);

roleRouter.delete("/:id", CatchAsync(roleController.delete));

export default roleRouter;
