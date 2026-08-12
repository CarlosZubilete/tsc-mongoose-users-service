import { Role } from "@models/role.model";
import mongoose, { Schema } from "mongoose";

const Role: Schema = new Schema<Role>(
    {
        name: { type: String, required: true, unique: true, trim: true },
        permissions: {
            type: [String],
            lowercase: true,
            trim: true,
            required: true,
        },
        level: {
            type: Number,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const RoleCollection = mongoose.model<Role>("roles", Role);
