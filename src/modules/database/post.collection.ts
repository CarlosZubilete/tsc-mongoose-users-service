import { Post } from "@models/post.model";
import mongoose, { Schema } from "mongoose";

// Create a data-specific interface
// Omit 'id' and 'UserId' from the base Post, and redefine them for Mongoose.
export interface PostDocument extends Omit<Post, "userId">, Document {
    userId: mongoose.Types.ObjectId;
}

const Post: Schema = new Schema<PostDocument>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        userId: {
            ref: "users",
            // type: mongoose.Types.ObjectId,
            type: Schema.Types.ObjectId,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const PostCollection = mongoose.model<Post>("posts", Post);
