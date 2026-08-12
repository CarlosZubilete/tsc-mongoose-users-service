import mongoose, { Schema } from "mongoose";
import { Authentication } from "@models/auth.model";

const Authentication: Schema = new Schema<Authentication>(
    {
        token: { type: String, required: true },
        sub: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
        isValid: { type: Boolean, default: false }, // If i want to do a logic delete... 
        createdAt: { type: Date, default: Date.now, expires: 7200 }, // Token expires in 2 hour
    },
    {
        versionKey: false,
    },
);

export const AuthenticationCollection = mongoose.model<Authentication>(
    "authentications",
    Authentication,
);
