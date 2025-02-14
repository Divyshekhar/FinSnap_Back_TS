import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { userSchema } from "./validation/userValidation";
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const prisma = new PrismaClient();

exports.createUser = async (req: Request, res: Response) => {
    const parsed = userSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid data" });
    }
    try {
        const user = await prisma.user.create({
            data: parsed.data
        });
        res.status(201).json({message:user});
    }
    catch (error) {
        console.log(error)
        res.status(400).send({error})
    }
}

exports.updateUser = async (req: Request, res: Response) => {
    
    const userId = req.params.id;

    const updateUserSchema = userSchema.partial();
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data" })
    }
    if (Object.keys(parsed.data).length === 0) {
        return res.status(400).json({ message: "No data found to be updated" })
    }

    try {
        const updateUser = await prisma.user.update({
            where: { id: userId },
            data: parsed.data
        });
        res.status(200).json({ message: "User updated successfully", user: updateUser });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }

}
exports.getUser = async (req: Request, res: Response) => {
    try {
        const data = await prisma.user.findMany()
        res.status(200).json({ data });
    }
    catch (e) {
        res.status(400).json({ message: "Something went wrong" })
    }
}
exports.getUserbyId = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const user = await prisma.user.findFirst({
            where:
            {
                id: userId
            }
        })
        res.status(200).json({ user })
    }
    catch (e) {
        res.status(400).json({ message: "Error finding the user" })
    }
}



