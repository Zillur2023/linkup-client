import { z } from "zod";

export const loginValidationSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z
    .string()
    .trim()
    .min(4, "Password needs to be at lest 4 character"),
});

export const registerValidationSchema = z.object({
  name: z.string().min(1, "Please enter your name!"),
  email: z.string().email("Please enter a valid email address!"),
  password: z.string().min(4, "Must be at least 4 characters."),
});