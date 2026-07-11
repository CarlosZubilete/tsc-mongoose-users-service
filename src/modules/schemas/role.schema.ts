import { z } from "zod";

const CreateRoleSchema = z.object({
    name: z
        .string()
        .trim()
        .lowercase()
        .min(3, "Name must be at least 3 characters long.")
        .max(50, "The name must have a maximum of 50 characters."),
});

const UpdateRoleSchema = z.object({
    name: z
        .string()
        .trim()
        .lowercase()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "The name must have a maximum of 50 characters.")
        .optional(),
});

export { CreateRoleSchema, UpdateRoleSchema };
