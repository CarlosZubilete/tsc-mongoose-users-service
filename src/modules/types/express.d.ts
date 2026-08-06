import {  RoleResponse } from "@models/role.model";
import { UserResponse } from "@models/user.model";

declare global {
    namespace Express {
        interface Request {
            user_logged: UserResponse;
            user_logged_roles: RoleResponse[];
            token_verified: string;
        }
    }
}
