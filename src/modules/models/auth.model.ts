import { Document, Types } from "mongoose";

interface Authentication extends Document {
    id: string;
    sub: Types.ObjectId; // user_id
    token: string;
    isValid: boolean;
    createdAt: Date;
}

interface AuthLogin {
    email: string;
    password: string;
}

interface AuthCreate {
    sub: string; // user_id
    token: string;
    isValid: boolean;
}

interface AuthResponse {
    token: string;
}

export { Authentication, AuthLogin, AuthResponse, AuthCreate };
