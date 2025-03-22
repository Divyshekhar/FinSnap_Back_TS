import { z } from 'zod';

export const incomeSchema = z.object({
        amount: z.number().positive(),
        description: z.string(),
        category: z.string(),
        date: z.union([
                z.string().regex(/^\d{4}-\d{2}-\d{2}$/),  // Allows "yyyy-MM-dd"
                z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/) // Allows ISO format
            ]).optional(),
        title: z.string()
})
