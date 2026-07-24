import { JWT_SECRET } from "@config/env";
import jwt from "jsonwebtoken";

export const signJwt = (payload: object) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
};

export const verifyJwt = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};
