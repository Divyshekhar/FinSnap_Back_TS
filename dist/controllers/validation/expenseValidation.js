"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseSchema = void 0;
const zod_1 = require("zod");
exports.expenseSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
    description: zod_1.z.string(),
    category: zod_1.z.string(),
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    userId: zod_1.z.string(),
    title: zod_1.z.string()
});
