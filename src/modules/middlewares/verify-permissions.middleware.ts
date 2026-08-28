import { UnauthorizedError } from "@errors/unauthorized-error";
import { Method, permissions } from "@models/permissions.model";
import { NextFunction, Request, Response } from "express";
import { boolean } from "zod";

export const VerifyPermissions = async (
    req: Request,
    _: Response,
    next: NextFunction,
) => {
    try {
        const { method, user_logged_roles } = req;

        const fullPath = req.originalUrl.split("?")[0];

        // Extract the module from the path
        const segment = fullPath.split("/").filter(boolean);

        const [, , , moduleName, resourceId] = segment;

        // console.log(segment); // PRINT = [ '', 'users-service', 'v1', 'posts', '' ]
        // console.log(`Modulo Name: ${moduleName} | resourceId ${resourceId} `);
        // console.log("Current Path >> ", moduleName);

        // Built the method_type. It matches with the current HTTP method.
        const baseMethod = permissions.find(
            (p) => p.method === Method[method as keyof typeof Method],
        );

        // console.log(`Base method permissions >> ${baseMethod?.method}`);

        // Create a copy of the permission object to avoid mutating the global array
        const copyBaseMethod = baseMethod
            ? { ...baseMethod, permissions: [...baseMethod.permissions] }
            : undefined;

        // Build the permissions according to the module and scope, and avoid repeat permissions.
        
        if (
            !copyBaseMethod?.permissions.includes(
                `${moduleName}_${copyBaseMethod.scope}`,
            )
        )
            copyBaseMethod?.permissions.push(
                `${moduleName}_${copyBaseMethod.scope}`,
            );

        // console.log(`COPY Base method  >> ${copyBaseMethod?.method}`);
        // console.log(`COPY Base method.scope>> ${copyBaseMethod?.scope}`);

        // Merged User's permissions, without repeat.
        const userPermissions = [
            ...new Set(user_logged_roles?.flatMap((x) => x.permissions)),
        ];

        // console.log("userPermissions >> ", userPermissions);

        // Compare the permissions
        const matchPermissions = copyBaseMethod?.permissions.find((p) =>
            userPermissions.includes(p),
        );

        // console.log("matchPermissions >> ", matchPermissions);

        if (!matchPermissions)
            throw new UnauthorizedError("User is not Unauthorized");

        req.method_scope = `${moduleName}_${copyBaseMethod?.scope}`;

        // console.log(`Current path and scope = ${req.method_scope}`);

        next();
    } catch (error) {
        return next(error);
    }
};
