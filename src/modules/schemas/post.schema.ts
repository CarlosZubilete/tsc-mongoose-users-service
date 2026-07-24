import { z } from "zod";

const PostCreateSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name must have a maximum of 50 characters."),
    description: z
        .string()
        .trim()
        .min(5, "Description must be at least 5 characters long")
        .max(50, "Description must have a maximum of 50 characters."),
});

const PostUpdateSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name must have a maximum of 50 characters.").optional(),
    description: z
        .string()
        .trim()
        .min(5, "Description must be at least 5 characters long")
        .max(50, "Description must have a maximum of 50 characters.").optional(),
});

export { PostCreateSchema, PostUpdateSchema };
