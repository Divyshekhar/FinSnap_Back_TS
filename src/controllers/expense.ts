import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';
import { expenseSchema } from "./validation/expenseValidation";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request{
    user: {userId: string};
}

exports.createExpense = async (req: AuthenticatedRequest, res: Response) => {
    if(!req.user || !req.user.userId) return res.status(401).json({message: "Error Identifying Token"});
    const userId = req.user.userId;
    const parsed = expenseSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid inputs" });
    try {
        const expense = await prisma.expense.create({
            data: {
                ...parsed.data,
                userId: userId,
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
exports.getAllExpensesByuserId = async (req: AuthenticatedRequest, res: Response) => {
    if(!req.user || !req.user.userId) return res.status(401).json({message: "Error Identifying Token"});
    const userId = req.user.userId;
    try {
        const expense = await prisma.expense.findMany({
            where: { id: userId }
        })
        return res.status(200).json({ expense })
    } catch (error) {
        return res.status(400).json({ message: "Server Error" })
    }
}