import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';
import { incomeSchema } from "./validation/incomeValidation";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request{
    user: {userId: string}
}

exports.createIncome = async (req: AuthenticatedRequest, res: Response) => {
    if(!req.user || !req.user.userId) return res.status(401).json({message: "Error Identifying Token"});
    const userId = req.user.userId;
    const isValid = await prisma.user.findFirst({
            where:{
                id: userId
            }
        }
    )
    if(!isValid) return res.status(400).json({message: "Forbidden: User Not Found"});

    const parsed = incomeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid inputs" });
    try {
        const income = await prisma.income.create({
            data: {
                ...parsed.data,
                date: new Date()
            }
        })
        return res.status(200).json({ message: "Income Created",income })
    }
    catch (error) {
        return res.status(400).json({ message: "Server Error" });
    }
}

//remove this in prod

exports.getAllIncome = async (req: Request, res: Response) => {
    try {
        const income = await prisma.income.findMany();
        return res.status(200).json({ income })
    }
    catch (error) {
        return res.status(400).json({ message: "Server Error" });
    }
}
exports.getAllIncomeById = async (req: AuthenticatedRequest, res: Response) => {
    if(!req.user || !req.user.userId) return res.status(401).json({message: "Error Identifying Token"});
    const userId = req.user.userId;
    const isValid = await prisma.user.findFirst({
        where:{
            id: userId
        }
    })
    if(!isValid) return res.status(400).json({message: "Forbidden: User not found"});
    try {
        const income = await prisma.income.findMany({
            where: { id: userId }
        })
        return res.status(200).json({ income })
    } catch (error) {
        return res.status(400).json({ message: "Server Error" })
    }
}
exports.updateIncome = async(req: AuthenticatedRequest, res: Response) => {
    if(!req.user || !req.user.userId) return res.status(401).json({message: "Error Identifying Token"});
    const userId = req.user.userId;
    const incomeId = req.params.id;
    const isValid = await prisma.user.findFirst({
        where:{
            id: userId
        }
    })
    if(!isValid) return res.status(400).json({message: "Forbidden: User not found"});
    const updateIncomeSchema = incomeSchema.partial();
    const parsed = updateIncomeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Wrong data" });
    if (Object.keys(parsed.data).length === 0) {
        return res.status(400).json({ message: "No data found to be updated" })
    }
    try{
        const updatedIncome = await prisma.income.update({
            where: {
                id: incomeId,
                userId: userId
            },
            data: parsed.data
        })
        res.status(200).json({message: "Updated Successfully", updatedIncome});
    }
    catch(error){
        res.status(400).json({message: "Server Error"})
    }

}
exports.deleteIncome = async(req: AuthenticatedRequest, res: Response) => {
    if(!req.user || !req.user.userId) return res.status(401).json({message: "Error Identifying Token"});
    const userId = req.user.userId;
    const incomeId = req.params.id;
    const isValid = await prisma.user.findFirst({
        where:{
            id: userId
        }
    })
    if(!isValid) return res.status(400).json({message: "Forbidden: User not found"});
    try{
        const deletedIncome = await prisma.income.delete({
            where: {id: incomeId}
        })
        res.status(200).json({message: "Deleted Successfully", deletedIncome});
    }
    catch(error){
        res.status(400).json({message: "Server Error"})
    }
}