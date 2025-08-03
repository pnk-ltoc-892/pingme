import z from "zod";
import { usernameValidation } from "./Validations.js";


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid Email Address"}),
    password: z.string().min(4, {message: "Password must be atleast 4 characters"})
})