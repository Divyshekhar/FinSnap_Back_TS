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
const incomeValidation_1 = require("./validation/incomeValidation");
const prisma = new client_1.PrismaClient();
exports.createIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.userId)
        return res.status(401).json({ message: "Error Identifying Token" });
    const userId = req.user.userId;
    const isValid = yield prisma.user.findFirst({
        where: {
            id: userId
        }
    });
    if (!isValid)
        return res.status(400).json({ message: "Forbidden: User Not Found" });
    const parsed = incomeValidation_1.incomeSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: "Invalid inputs" });
    try {
        const income = yield prisma.income.create({
            data: Object.assign(Object.assign({}, parsed.data), { date: new Date() })
        });
        return res.status(200).json({ message: "Income Created", income });
    }
    catch (error) {
        return res.status(400).json({ message: "Server Error" });
    }
});
//remove this in prod
exports.getAllIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const income = yield prisma.income.findMany();
        return res.status(200).json({ income });
    }
    catch (error) {
        return res.status(400).json({ message: "Server Error" });
    }
});
exports.getAllIncomeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.userId)
        return res.status(401).json({ message: "Error Identifying Token" });
    const userId = req.user.userId;
    const isValid = yield prisma.user.findFirst({
        where: {
            id: userId
        }
    });
    if (!isValid)
        return res.status(400).json({ message: "Forbidden: User not found" });
    try {
        const income = yield prisma.income.findMany({
            where: { id: userId }
        });
        return res.status(200).json({ income });
    }
    catch (error) {
        return res.status(400).json({ message: "Server Error" });
    }
});
exports.updateIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.userId)
        return res.status(401).json({ message: "Error Identifying Token" });
    const userId = req.user.userId;
    const incomeId = req.params.id;
    const isValid = yield prisma.user.findFirst({
        where: {
            id: userId
        }
    });
    if (!isValid)
        return res.status(400).json({ message: "Forbidden: User not found" });
    const updateIncomeSchema = incomeValidation_1.incomeSchema.partial();
    const parsed = updateIncomeSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: "Wrong data" });
    if (Object.keys(parsed.data).length === 0) {
        return res.status(400).json({ message: "No data found to be updated" });
    }
    try {
        const updatedIncome = yield prisma.income.update({
            where: {
                id: incomeId,
                userId: userId
            },
            data: parsed.data
        });
        res.status(200).json({ message: "Updated Successfully", updatedIncome });
    }
    catch (error) {
        res.status(400).json({ message: "Server Error" });
    }
});
exports.deleteIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.userId)
        return res.status(401).json({ message: "Error Identifying Token" });
    const userId = req.user.userId;
    const incomeId = req.params.id;
    const isValid = yield prisma.user.findFirst({
        where: {
            id: userId
        }
    });
    if (!isValid)
        return res.status(400).json({ message: "Forbidden: User not found" });
    try {
        const deletedIncome = yield prisma.income.delete({
            where: { id: incomeId }
        });
        res.status(200).json({ message: "Deleted Successfully", deletedIncome });
    }
    catch (error) {
        res.status(400).json({ message: "Server Error" });
    }
});
exports.calculateTotal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.userId)
        return res.status(401).json({ message: "Error Identifying Token" });
    const userId = req.user.userId;
    const isValid = yield prisma.user.findFirst({
        where: {
            id: userId
        }
    });
    if (!isValid)
        return res.status(400).json({ message: "Forbidden: User not found" });
    try {
        const total = yield prisma.income.aggregate({
            where: { userId: userId },
            _sum: { amount: true }
        });
        return res.status(200).json({ total: total._sum.amount || 0 });
    }
    catch (error) {
        res.status(400).json({ message: "Error calculating total" });
    }
});
