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
        where:{
            id: userId
        }
    })
    if(!isValid) return res.status(400).json({message: "Error: Invalid User"});
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
        res.status(200).json({message: "Expense Updated Successfully", updateExpense});

    }
    catch(error){
        res.status(400).json({message: "Server Error"})
    }
}
exports.deleteExpense = async (req: AuthenticatedRequest, res: Response) => {
    if(!req.user || !req.user.userId) return res.status(401).json({message: "Error Identifying Token"});
    const userId = req.user.userId;
    const expenseId = req.params.id;

    const userExists = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!userExists) {
        return res.status(403).json({ message: "Forbidden: Invalid user" });
    }
    try{
        const deletedExpense = await prisma.expense.delete({
                where: {
                    id: expenseId
                }
            }
        )
        res.status(200).json({message: "Successfully Deleted", deletedExpense});
    }
    catch(error){
        res.status(400).json({message: "Server Error"});
    }

    
}