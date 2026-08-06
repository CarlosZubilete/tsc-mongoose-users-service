import { z } from "zod";

const CreateRoleSchema = z
    .object({
        name: z
            .string()
            .trim()
            .lowercase()
            .min(3, "Name must be at least 3 characters long.")
            .max(50, "The name must have a maximum of 50 characters."),
        permissions: z.array(
            z
                .string()
                .trim()
                .lowercase()
                .min(3, "Permission must be at least 3 characters long")
                .max(50, "Permission must have a maximum of 50 characters."),
        ),
        level: z.number().positive("Level must be positive"),
    })
    .strict();

const UpdateRoleSchema = z
    .object({
        name: z
            .string()
            .trim()
            .lowercase()
            .min(3, "Name must be at least 3 characters long")
            .max(50, "The name must have a maximum of 50 characters.")
            .optional(),
        permissions: z
            .array(
                z
                    .string()
                    .lowercase()
                    .trim()
                    .min(3, "Permission must be at least 3 characters long")
                    .max(
                        50,
                        "Permission must have a maximum of 50 characters.",
                    ),
            )
            .optional(),
        level: z.number().positive("Level must be positive").optional(),
    })
    .strict();

export { CreateRoleSchema, UpdateRoleSchema };
