import { ConflictError } from "@errors/conflict-error";
import { NotFoundError } from "@errors/not-found-error";
import { RoleCreate, RoleUpdate } from "@models/role.model";
import { Request, Response } from "express";
import { IRoleService } from "modules/services/roles.service";

export class RoleController {
    private service: IRoleService;

    constructor(roleService: IRoleService) {
        this.service = roleService;
    }

    public getList = async (_: Request, res: Response) => {
        const roles = await this.service.findRoles();
        res.status(200).json(roles);
    };

    public getById = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        const role = await this.service.findRoleById(id);

        if (!role)
            throw new NotFoundError(`Role with this id: ${id} not found.`);

        res.status(200).json(role);
    };

    public create = async (req: Request, res: Response) => {
        const name = req.body.name as string;
        if (await this.service.existsRoleByName(name))
            throw new ConflictError(
                `Role with this name: ${name} already exists.`,
            );

        const role = req.body as RoleCreate;
        const created = await this.service.createRole(role);

        // TODO: verify "created !== null"

        res.status(201).json(created);
    };

    public update = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const exists = await this.service.existsRoleById(id);
        if (!exists)
            throw new NotFoundError(`Role whit this id: ${id} not found.`);

        if (req.body.name != null) {
            const name = req.body.name as string;
            if (await this.service.existsRoleByName(name))
                throw new ConflictError(
                    `Role with this name: ${name} already exists.`,
                );
        }

        const partialRole = req.body as RoleUpdate;

        const updated = await this.service.updateRole(id, partialRole);

        res.status(200).json(updated);
    };

    public delete = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        const deleted = await this.service.deleteRole(id);

        if (!deleted)
            throw new NotFoundError(`Role whit this id: ${id} not found.`);

        res.status(204).end();
    };
}
