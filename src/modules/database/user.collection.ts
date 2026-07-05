import { User } from "@models/user.model";
import mongoose, { Schema } from "mongoose";

const User: Schema = new Schema<User>(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, require: true, unique: true },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const UserCollection = mongoose.model<User>("users", User);
