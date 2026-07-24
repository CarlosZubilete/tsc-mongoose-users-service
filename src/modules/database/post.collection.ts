import { Post } from "@models/post.model";
import mongoose, { Schema } from "mongoose";

const Post: Schema = new Schema<Post>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "users",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const PostCollection = mongoose.model<Post>("posts", Post);
