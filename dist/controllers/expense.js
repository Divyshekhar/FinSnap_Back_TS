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
const expenseValidation_1 = require("./validation/expenseValidation");
const prisma = new client_1.PrismaClient();
exports.createExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.userId)
        return res.status(401).json({ message: "Error Identifying Token" });
    const userId = req.user.userId;
    const isValid = yield prisma.user.findFirst({
        where: {
            id: userId
        }
    });
    if (!isValid)
        return res.status(400).json({ message: "Error: Invalid User" });
    const parsed = expenseValidation_1.expenseSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: "Invalid inputs" });
    try {
        const expense = yield prisma.expense.create({
            data: Object.assign(Object.assign({}, parsed.data), { userId: userId, date: parsed.data.date ? new Date(parsed.data.date) : new Date() })
        });
        return res.status(200).json({ expenseCreate: expense });
    }
    catch (error) {
        return res.status(400).json({ message: "Server Error", error });
    }
});
exports.expenseCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.userId)
        return res.status(401).json({ message: "Error Identifying Token" });
    const userId = req.user.userId;
    const isValid = yield prisma.user.findFirst({
        where: { id: userId }
    });
    try {
        if (!isValid)
            return res.status(401).json({ message: "Invalid Token" });
        const expenseCategory = yield prisma.expense.groupBy({
            by: ["category"],
            where: { userId: userId },
            _sum: { amount: true }
        });
        res.status(200).json(expenseCategory);
    }
    catch (error) {
        res.status(400).json({ message: "Server Error" });
    }
});
//remove this in prod
exports.getAllExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expense = yield prisma.expense.findMany();
        return res.status(200).json({ expense });
    }
    catch (error) {
        return res.status(400).json({ message: "Server Error" });
    }
});
exports.getAllExpensesByuserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.userId)
        return res.status(401).json({ message: "Error Identifying Token" });
    const userId = req.user.userId;
    try {
        const expense = yield prisma.expense.findMany({
            where: { userId: userId }
        });
        return res.status(200).json({ expense });
    }
    catch (error) {
        return res.status(400).json({ message: "Server Error" });
    }
});
exports.updateExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.userId)
        return res.status(401).json({ message: "Error Identifying Token" });
    const userId = req.user.userId;
    const expenseId = req.params.id;
    const userExists = yield prisma.user.findUnique({
        where: { id: userId },
    });
    if (!userExists) {
        return res.status(403).json({ message: "Forbidden: Invalid user" });
    }
    const updateExpenseSchema = expenseValidation_1.expenseSchema.partial();
    const parsed = updateExpenseSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: "Wrong data" });
    if (Object.keys(parsed.data).length === 0) {
        return res.status(400).json({ message: "No data found to be updated" });
    }
    try {
        const updateExpense = yield prisma.expense.update({
            where: {
                id: expenseId,
                userId: userId
            },
            data: parsed.data
        });
        res.status(200).json({ message: "Expense Updated Successfully", updateExpense });
    }
    catch (error) {
        res.status(400).json({ message: "Server Error" });
    }
});
exports.deleteExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.userId)
        return res.status(401).json({ message: "Error Identifying Token" });
    const userId = req.user.userId;
    const expenseId = req.params.id;
    const userExists = yield prisma.user.findUnique({
        where: { id: userId },
    });
    if (!userExists) {
        return res.status(403).json({ message: "Forbidden: Invalid user" });
    }
    try {
        const deletedExpense = yield prisma.expense.delete({
            where: {
                id: expenseId
            }
        });
        res.status(200).json({ message: "Successfully Deleted", deletedExpense });
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
        where: { id: userId }
    });
    if (!isValid)
        return res.status(400).json({ message: "Error: Invalid User" });
    try {
        const total = yield prisma.expense.aggregate({
            where: { userId: userId },
            _sum: { amount: true }
        });
        return res.status(200).json({ total: total._sum.amount || 0 });
    }
    catch (error) {
        res.status(400).json({ message: "Error Calculating the total expense" });
    }
    ;
});
exports.getExpenseHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.userId)
        res.status(401).json({ message: "Error: Identifying Token" });
    const userId = req.user.userId;
    const category = req.params.category;
    const isValid = yield prisma.user.findFirst({
        where: { id: userId }
    });
    if (!isValid)
        return res.status(400).json({ message: "Error: Invalid User" });
    try {
        const expenses = yield prisma.expense.findMany({
            select: { title: true, amount: true, date: true, id: true },
            where: { userId: userId, category: category },
            orderBy: { createdAt: "desc" }
        });
        res.status(200).json(expenses);
    }
    catch (error) {
        res.status(400).json({ message: "Error occured" });
    }
});
