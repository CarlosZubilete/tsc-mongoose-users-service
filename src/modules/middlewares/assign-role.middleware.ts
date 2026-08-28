import { ForbiddenError } from "@errors/forbidden-error";
import { NotFoundError } from "@errors/not-found-error";
import { IRoleRepository, RoleRepository } from "@repositories/role.repository";
import { NextFunction, Request, Response } from "express";
import { IRoleService, RoleService } from "@services/role.service";

const roleRepository: IRoleRepository = new RoleRepository();
const roleService: IRoleService = new RoleService(roleRepository);

/// This middleware is using when it needed to assign a role in a new user.
export const AssignRoles = async (
    req: Request,
    _: Response,
    next: NextFunction,
) => {
    try {
        // 1. Extract roles and ensure .
        const requestRoles: string[] =
            req.body && req.body?.roles ? req.body.roles : [];

        // 2. Identify if this is a public registration (/auth/register)
        // If method_scope is undefined, no one is logged in, and no specific route scope was hit.
        const isNewRegister: boolean = req.method_scope === undefined;

        // 3. SCENARIO A: Standard Profile Update (No roles provided)
        // If they are just updating their name/password, skip this middleware entirely!
        if (!isNewRegister && requestRoles.length === 0) {
            return next();
        }

        // 4. SCENARIO B & C: Public Register OR Admin updating roles
        let rolesToAssign: string[] = [];

        if (isNewRegister) {
            rolesToAssign = ["guest"]; // Public registers always get forced to guest
        } else {
            rolesToAssign = requestRoles; // Admins mapping custom roles
        }

        // 5. Look up the roles in the database
        const existsRoles = await roleService.findRolesByName(rolesToAssign);

        // console.log(`existsRoles >>> ${existsRoles}`);

        // 6. IF the lengths don't match, or more roles sent by the user do not exits in the DB.
        if (!isNewRegister && existsRoles.length !== requestRoles.length)
            throw new NotFoundError(
                `One or more provided roles do not exist in the system.`,
            );

        // 7. Check Privilege Escalation if someone is logged in
        if (req.user_logged) {
            const requesterLevel = req.user_logged_roles.map(
                (rol) => rol.level,
            );
            
            let isAllowed = true;

            for (const newRole of existsRoles) {
                for (const level of requesterLevel) {
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

        // 8. Reassign the body with valid role IDs so the controller can save them
        req.body.roles = existsRoles.map((role) => role.id);

        next();
    } catch (error) {
        return next(error);
    }
};
