import { Role } from "@models/role.model";
import mongoose, { Schema } from "mongoose";

const Role: Schema = new Schema<Role>(
    {
        name: { type: String, required: true, unique: true, trim: true },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const RoleCollection = mongoose.model<Role>("roles", Role);
