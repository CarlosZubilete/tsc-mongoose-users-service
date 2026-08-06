import { Document } from "mongoose";

// Model
interface Role extends Document {
    id: string;
    name: string;
    permissions: string[];
    level: number;
}

interface RoleCreate {
    name: string;
    permissions: string[];
    level: number;
}

interface RoleUpdate {
    name?: string;
    permissions?: string[];
    level: number;
}

interface RoleResponse {
    id: string;
    name: string;
    permissions: string[];
    level: number;
}

export { Role, RoleCreate, RoleUpdate, RoleResponse };
