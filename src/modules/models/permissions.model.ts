// Methods HTTP
export enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
}

// Scopes for permissions
export enum Scope {
    Read = "read",
    Write = "write",
    Update = "update",
    Delete = "delete",
    UNKNOWN = "unknown",
}

export interface IPermission {
    method: Method;
    scope: Scope;
    permissions: string[];
}

// Permissions structure
export const permissions: IPermission[] = [
    {
        method: Method.GET,
        scope: Scope.Read,
        permissions: ["root_access"],
    },
    {
        method: Method.POST,
        scope: Scope.Write,
        permissions: ["root_access"],
    },
    {
        method: Method.PUT,
        scope: Scope.Update,
        permissions: ["root_access"],
    },
    {
        method: Method.PATCH,
        scope: Scope.Update,
        permissions: ["root_access"],
    },
    {
        method: Method.DELETE,
        scope: Scope.Delete,
        permissions: ["root_access"],
    },
];
