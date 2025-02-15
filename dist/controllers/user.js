"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const userValidation_1 = require("./validation/userValidation");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const prisma = new client_1.PrismaClient();
exports.createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = userValidation_1.userSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid data" });
    }
    try {
        const user = yield prisma.user.create({
            data: parsed.data
        });
        res.status(201).json({ message: user });
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error });
    }
});
exports.updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.userId)
        return res.status(401).json({ message: "Unauthorized" });
    const userId = req.user.userId;
    const updateUserSchema = userValidation_1.userSchema.partial();
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data" });
    }
    if (Object.keys(parsed.data).length === 0) {
        return res.status(400).json({ message: "No data found to be updated" });
    }
    try {
        const updateUser = yield prisma.user.update({
            where: { id: userId },
            data: parsed.data
        });
        res.status(200).json({ message: "User updated successfully", user: updateUser });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.user.findMany();
        res.status(200).json({ data });
    }
    catch (e) {
        res.status(400).json({ message: "Something went wrong" });
    }
});
exports.getUserbyId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const user = yield prisma.user.findFirst({
            where: {
                id: userId
            }
        });
        res.status(200).json({ user });
    }
    catch (e) {
        res.status(400).json({ message: "Error finding the user" });
    }
});
exports.signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prisma.user.findFirst({
        where: {
            email: email
        }
    });
    if (!user || Object.keys(user).length === 0)
        return res.status(400);
    if (user.password !== password) {
        res.status(400).json({ msg: "wrong cred" });
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.SECRET_KEY);
    res.status(200).json({ token });
});
