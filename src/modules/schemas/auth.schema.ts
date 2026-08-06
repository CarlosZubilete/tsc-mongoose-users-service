import { email, z } from "zod";

const AuthLoginSchema = z
    .object({
        email: z.string().email("Invalid email address").max(100),
        password: z
            .string()
            .trim()
            .min(5, "Password must be at least 5 characters long")
            .max(50, "Password must have a maximum of 50 characters."),
    })
    .strict();

const AuthRegisterSchema = z
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
    })
    .strict();

export { AuthLoginSchema, AuthRegisterSchema };
