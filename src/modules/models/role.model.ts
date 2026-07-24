import { Document } from "mongoose";

// Model
interface Role extends Document {
    id: string;
    name: string;
}

interface RoleCreate {
    name: string;
}

interface RoleUpdate {
    name?: string;
}

interface RoleResponse {
    id: string;
    name: string;
}

export { Role, RoleCreate, RoleUpdate, RoleResponse };
