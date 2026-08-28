import { RoleCreate, RoleUpdate } from "@models/role.model";
import { Request, Response } from "express";
import { IRoleService } from "@services/role.service";

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

        res.status(200).json(role);
    };

    public create = async (req: Request, res: Response) => {
        // Set the permissions because they are not repeat
        const permissions = req.body.permissions as string[];
        const unique_permissions = [...new Set(permissions)];

        req.body.permissions = unique_permissions;

        const role = req.body as RoleCreate;
        const created = await this.service.createRole(role);

        res.status(201).json(created);
    };

    public update = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        if (req.body.permissions) {
            const permissions = req.body.permissions as string[];
            const unique_permissions = [...new Set(permissions)];
            req.body.permissions = unique_permissions;
        }

        const partialRole = req.body as RoleUpdate;

        const updated = await this.service.updateRole(id, partialRole);

        res.status(200).json(updated);
    };

    public delete = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        await this.service.deleteRole(id);

        res.status(204).end();
    };
}
