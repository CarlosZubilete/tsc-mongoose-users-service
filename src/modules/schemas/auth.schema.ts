import { email, z } from "zod";

const AuthLoginSchema = z.object({
    email: z.string().email("Invalid email address").max(100),
    password: z
        .string()
        .trim()
        .min(5, "Password must be at least 5 characters long")
        .max(50, "Password must have a maximum of 50 characters."),
});

export { AuthLoginSchema};
