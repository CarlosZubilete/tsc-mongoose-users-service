import { z } from "zod";

const CreateUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(5, "Name must be at least 5 characters long")
        .max(100),
    username: z
        .string()
        .trim()
        .min(5, "Username must be at least 5 characters long")
        .max(50),
    email: z.string().email("Invalid email address").max(100),
});

const UpdateUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(5, "Name must be at least 5 characters long")
        .max(100)
        .optional(),
    username: z
        .string()
        .trim()
        .min(5, "Username must be at least 5 characters long")
        .max(50)
        .optional(),
    email: z.string().email("Invalid email address").max(100).optional(),
});

// type CreateUser = z.infer<typeof CreateUserSchema>;
// type UpdateUser = z.infer<typeof UpdateUserSchema>;

// export { CreateUser, UpdateUser };

export { CreateUserSchema, UpdateUserSchema };
