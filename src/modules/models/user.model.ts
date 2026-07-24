import { Document } from "mongoose";

// domain
interface User extends Document {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
}

// Create
interface UserCreate {
    name: string;
    username: string;
    email: string;
    password: string;
}

// Update
interface UserUpdate {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
}

// Response
interface UserResponse {
    id: string;
    email: string;
    username: string;
    // Todo: username and role.
}

export { User, UserCreate, UserUpdate, UserResponse };
