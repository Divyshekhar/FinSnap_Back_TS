import { z } from 'zod';

export const expenseSchema = z.object({
        amount: z.number().positive(),
        description: z.string(),
        category: z.string(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/).optional(),
        title: z.string()
})
