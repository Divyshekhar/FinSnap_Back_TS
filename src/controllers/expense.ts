import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';
import { expenseSchema } from "./validation/expenseValidation";

const prisma = new PrismaClient();

exports.createExpense = async (req: Request, res: Response) => {
    const parsed = expenseSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid inputs" });
    try {
        const expense = await prisma.expense.create({
            data: {
                ...parsed.data,
                date: new Date()
            }
        })
        return res.status(200).json({ expense })
    }
    catch (error) {
        return res.status(400).json({ message: "Server Error" });
    }
}

exports.getAllExpense = async (req: Request, res: Response) => {
    try {
        const expense = await prisma.expense.findMany();
        return res.status(200).json({ expense })
    }
    catch (error) {
        return res.status(400).json({ message: "Server Error" });
    }
}
exports.getExpenseById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const expense = await prisma.expense.findUnique({
            where: { id: id }
        })
        return res.status(200).json({ expense })
    } catch (error) {
        return res.status(400).json({ message: "Server Error" })
    }
}