import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { userSchema } from "./validation/userValidation";
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
    user: { userId: string };
}

exports.createUser = async (req: Request, res: Response) => {
    const parsed = userSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid data" });
    }
    try {
        const user = await prisma.user.create({
            data: parsed.data
        });
        const token = jwt.sign({ name: user.name, userId: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "24h" });

        res.status(201).json({ token: token });
    }
    catch (error) {
        console.log(error)
        res.status(400).send({ error })
    }
}

exports.updateUser = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user || !req.user.userId) return res.status(401).json({ message: "Unauthorized" });
    const userId = req.user.userId;
    const userExists = await prisma.user.findFirst({
        where: {
            id: userId
        }
    }
    )
    if (!userExists) return res.status(403).json({ message: "Forbidden: Invalid User" })
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
//remove this in prod
exports.getUser = async (req: Request, res: Response) => {
    try {
        const data = await prisma.user.findMany()
        res.status(200).json({ data });
    }
    catch (e) {
        res.status(400).json({ message: "Something went wrong" })
    }
}
exports.getUserbyId = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user || !req.user.userId) return res.status(401).json({ message: "Unauthorized" });
    const userId = req.user.userId;
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        }
        )
        if (!user) return res.status(403).json({ message: "Forbidden: Invalid User" })
        return res.status(200).json({ user })
    }catch(e){
        res.status(400).json({message: "Error"})
    }

}

exports.signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    if (!user || Object.keys(user).length === 0) return res.status(400).json({ message: "error finding the user" })
    if (user.password !== password) return res.status(400).json({ msg: "wrong cred" })
    const token = jwt.sign({ name: user.name, userId: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "24h" });
    res.cookie("token", token, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.json({message: "login successful"})
}
exports.logout = async (req: Request, res: Response) => {
    res.clearCookie("token");
    res.status(200).json({message: "Logged out Successfully"});
}