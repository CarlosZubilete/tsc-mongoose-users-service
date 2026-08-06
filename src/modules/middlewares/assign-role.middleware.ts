import { ForbiddenError } from "@errors/forbidden-error";
import { NotFoundError } from "@errors/not-found-error";
import { IRoleRepository, RoleRepository } from "@repositories/role.repository";
import { NextFunction, Request, Response } from "express";
import { IRoleService, RoleService } from "modules/services/role.service";

const roleRepository: IRoleRepository = new RoleRepository();
const roleService: IRoleService = new RoleService(roleRepository);

/// This middleware is using when it needed to assign a role in a new user.
export const AssignRoles = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        // Extract roles and ensure .
        const requestRoles: string[] =
            req.body && req.body?.roles ? req.body.roles : [];

        let isNewRegister = false;
        let roles: string[] = [];

        // It is a valid array and does not have any role, defaulting to guest.
        if (Array.isArray(requestRoles)) {
            if (requestRoles.length !== 0) roles = requestRoles;
            else {
                // This happened when is a new register.
                isNewRegister = true;
                roles = ["guest"];
            }
        }

        // Found the role in the database.
        const existsRoles = await roleService.findRoleByName(roles);

        // IF the lengths don't match, or more roles sent by the user do not exits in the DB.
        if (!isNewRegister && existsRoles.length !== requestRoles.length)
            throw new NotFoundError(
                `One or more provided roles do not exist in the system.`,
            );

        // Check if someone is login in.
        if (req.user_logged) {
            // list with each levels
            const requesterLevel = req.user_logged_roles.map(
                (rol) => rol.level,
            );
            // flat
            let isAllowed = true;
            // Check every role they are trying to assign
            for (const newRole of existsRoles) {
                for (const level of requesterLevel) {
                    // console.log("newRole Level >> ", newRole.level);
                    // console.log("level >> ", level);
                    if (newRole.level >= level) {
                        isAllowed = false;
                    }
                }
            }

            if (!isAllowed)
                throw new ForbiddenError(
                    `Privilege Escalation Blocked: You cannot assign a role equal to or higher than your own.`,
                );
        }

        req.body.roles = existsRoles.map((role) => role.id);

        // console.log("Verify roles: >> ", req.body.roles);

        next();
    } catch (error) {
        next(error);
    }
};
