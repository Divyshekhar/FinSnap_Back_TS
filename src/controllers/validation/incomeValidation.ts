import { z } from 'zod';

export const incomeSchema = z.object({
        amount: z.number().positive(),
        description: z.string(),
        category: z.string(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        title: z.string()
})
