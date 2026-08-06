import { Document, Types } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

// This is using when verify the payload from the req
interface AuthTokenPayload extends JwtPayload {
    sub: string;
    email: string;
    username: string;
    roles: string[];
}

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

export {
    Authentication,
    AuthLogin,
    AuthResponse,
    AuthCreate,
    AuthTokenPayload,
};
