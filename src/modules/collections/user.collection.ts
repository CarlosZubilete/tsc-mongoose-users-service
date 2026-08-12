import { User } from "@models/user.model";
import mongoose, { Schema } from "mongoose";

const User: Schema = new Schema<User>(
    {
        name: { type: String, required: true, trim: true },
        username: { type: String, required: true, unique: true, trim: true },
        email: { type: String, require: true, unique: true, trim: true },
        password: { type: String, require: true, trim: true },
        roles: [
            {
                ref: "roles",
                type: Schema.Types.ObjectId,
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const UserCollection = mongoose.model<User>("users", User);
