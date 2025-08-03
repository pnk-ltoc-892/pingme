import z from "zod";

export const usernameValidation = z
        .string()
        .min(3, "Username must be atleast 3 chars")
        .max(12, "Username must be atmost 12 chars")
        .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")