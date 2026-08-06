import { Document } from "mongoose";
import { Role, RoleResponse } from "./role.model";

// domain
interface User extends Document {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    roles: Role[];
}

// Create
interface UserCreate {
    name: string;
    username: string;
    email: string;
    password: string;
    roles: Role[];
}

// Update
interface UserUpdate {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    roles: Role[];
}

// Response
interface UserResponse {
    id: string;
    email: string;
    username: string;
    roles: string[];

}

export { User, UserCreate, UserUpdate, UserResponse };
