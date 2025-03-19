import { Expense, PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';
import { expenseSchema } from "./validation/expenseValidation";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
    user: { userId: string };
}

exports.createExpense = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user || !req.user.userId) return res.status(401).json({ message: "Error Identifying Token" });
    const userId = req.user.userId;
    const isValid = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })
    if (!isValid) return res.status(400).json({ message: "Error: Invalid User" });
    const parsed = expenseSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid inputs" });
    try {
        const expense = await prisma.expense.create({
            data: {
                ...parsed.data,
                userId: userId,
                date: parsed.data.date ? new Date(parsed.data.date) : new Date()
            }
        })
        return res.status(200).json({ expenseCreate: expense })
    }
    catch (error) {
        return res.status(400).json({ message: "Server Error", error });
    }
}
exports.expenseCategory = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user || !req.user.userId) return res.status(401).json({ message: "Error Identifying Token" })
    const userId = req.user.userId;
    const isValid = await prisma.user.findFirst({
        where: { id: userId }
    })
    try {
        if (!isValid) return res.status(401).json({ message: "Invalid Token" })
        const expenseCategory = await prisma.expense.groupBy({
            by: ["category"],
            where: { userId: userId },
            _sum: { amount: true }
        })
        res.status(200).json(expenseCategory)
    }
    catch (error) {
        res.status(400).json({ message: "Server Error" })
    }
}


//remove this in prod
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
    if (!req.user || !req.user.userId) return res.status(401).json({ message: "Error Identifying Token" });
    const userId = req.user.userId;
    try {
        const expense = await prisma.expense.findMany({
            where: { userId: userId }
        })
        return res.status(200).json({ expense })
    } catch (error) {
        return res.status(400).json({ message: "Server Error" })
    }
}
exports.updateExpense = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user || !req.user.userId) return res.status(401).json({ message: "Error Identifying Token" });
    const userId = req.user.userId;
    const expenseId = req.params.id;
    const userExists = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!userExists) {
        return res.status(403).json({ message: "Forbidden: Invalid user" });
    }

    const updateExpenseSchema = expenseSchema.partial();
    const parsed = updateExpenseSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Wrong data" });
    if (Object.keys(parsed.data).length === 0) {
        return res.status(400).json({ message: "No data found to be updated" })
    }
    try {
        const updateExpense = await prisma.expense.update({
            where: {
                id: expenseId,
                userId: userId
            },
            data: parsed.data
        })
        res.status(200).json({ message: "Expense Updated Successfully", updateExpense });

    }
    catch (error) {
        res.status(400).json({ message: "Server Error" })
    }
}
exports.deleteExpense = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user || !req.user.userId) return res.status(401).json({ message: "Error Identifying Token" });
    const userId = req.user.userId;
    const expenseId = req.params.id;

    const userExists = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!userExists) {
        return res.status(403).json({ message: "Forbidden: Invalid user" });
    }
    try {
        const deletedExpense = await prisma.expense.delete({
            where: {
                id: expenseId
            }
        }
        )
        res.status(200).json({ message: "Successfully Deleted", deletedExpense });
    }
    catch (error) {
        res.status(400).json({ message: "Server Error" });
    }
}
exports.calculateTotal = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user || !req.user.userId) return res.status(401).json({ message: "Error Identifying Token" });
    const userId = req.user.userId;
    const isValid = await prisma.user.findFirst({
        where: { id: userId }
    })
    if (!isValid) return res.status(400).json({ message: "Error: Invalid User" });
    try {
        const total = await prisma.expense.aggregate({
            where: { userId: userId },
            _sum: { amount: true }
        })
        return res.status(200).json({ total: total._sum.amount || 0 });
    }
    catch (error) {
        res.status(400).json({ message: "Error Calculating the total expense" });
    };
}
exports.getExpenseHistory = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user || !req.user.userId) res.status(401).json({ message: "Error: Identifying Token" });
    const userId = req.user.userId;
    const category = req.params.category;
    const isValid = await prisma.user.findFirst({
        where: { id: userId }
    })
    if (!isValid) return res.status(400).json({ message: "Error: Invalid User" });
    try {
        const expenses = await prisma.expense.findMany({
            select: { title: true, amount: true, date: true, id: true },
            where: { userId: userId, category: category },
            orderBy: { createdAt: "desc" }

        })
        res.status(200).json(expenses);
    } catch (error) {
        res.status(400).json({ message: "Error occured" });
    }
}