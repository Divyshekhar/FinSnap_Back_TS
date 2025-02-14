import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';
import { incomeSchema } from "./validation/incomeValidation";

const prisma = new PrismaClient();

exports.createIncome = async (req: Request, res: Response) => {
    const parsed = incomeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid inputs" });
    try {
        const income = await prisma.income.create({
            data: {
                ...parsed.data,
                date: new Date()
            }
        })
        return res.status(200).json({ income })
    }
    catch (error) {
        return res.status(400).json({ message: "Server Error" });
    }
}

exports.getAllIncome = async (req: Request, res: Response) => {
    try {
        const income = await prisma.income.findMany();
        return res.status(200).json({ income })
    }
    catch (error) {
        return res.status(400).json({ message: "Server Error" });
    }
}
exports.getIncomeById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const income = await prisma.income.findUnique({
            where: { id: id }
        })
        return res.status(200).json({ income })
    } catch (error) {
        return res.status(400).json({ message: "Server Error" })
    }
}