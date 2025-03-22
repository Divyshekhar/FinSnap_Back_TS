"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseSchema = void 0;
const zod_1 = require("zod");
exports.expenseSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
    description: zod_1.z.string(),
    category: zod_1.z.string(),
    date: zod_1.z.union([
        zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Allows "yyyy-MM-dd"
        zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/) // Allows ISO format
    ]).optional(),
    title: zod_1.z.string()
});
