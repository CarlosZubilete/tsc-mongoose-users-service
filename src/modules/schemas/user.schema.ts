import { z } from "zod";

const CreateUserSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(3, "Name must be at least 3 characters long")
            .max(50, "Name must have a maximum of 50 characters."),
        username: z
            .string()
            .trim()
            .min(3, "Username must be at least 3 characters long")
            .max(50, "Username must have a maximum of 50 characters."),
        email: z.string().email("Invalid email address").max(100),
        password: z
            .string()
            .trim()
            .min(5, "Password must be at least 5 characters long")
            .max(50, "Password must have a maximum of 50 characters."),
        roles: z.array(
            z
                .string()
                .trim()
                .min(3, "Role must be at least 3 characters long")
                .max(50, "Role must have a maximum of 50 characters."),
        ),
    })
    .strict();

const UpdateUserSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(3, "Name must be at least 3 characters long")
            .max(50, "Name must have a maximum of 50 characters.")
            .optional(),
        username: z
            .string()
            .trim()
            .min(3, "Username must be at least 3 characters long")
            .max(50, "Username must have a maximum of 50 characters.")
            .optional(),
        email: z.string().email("Invalid email address").max(100).optional(),
        password: z
            .string()
            .trim()
            .min(5, "Password must be at least 5 characters long")
            .max(50, "Password must have a maximum of 50 characters.")
            .optional(),
        newPassword: z
            .string()
            .trim()
            .min(5, "New password must be at least 5 characters long")
            .max(50, "New password must have a maximum of 50 characters.")
            .optional(),
        roles: z
            .array(
                z
                    .string()
                    .trim()
                    .min(3, "Role must be at least 3 characters long")
                    .max(50, "Role must have a maximum of 50 characters."),
            )
            .optional(),
    })
    .strict();

export { CreateUserSchema, UpdateUserSchema };
