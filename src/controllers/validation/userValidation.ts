import { z } from 'zod';

export const userSchema = z.object({
    id: z.string().optional(), 
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})