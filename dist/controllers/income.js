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
    const parsed = incomeValidation_1.incomeSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: "Invalid inputs" });
    try {
        const income = yield prisma.income.create({
            data: Object.assign(Object.assign({}, parsed.data), { date: new Date() })
        });
        return res.status(200).json({ income });
    }
    catch (error) {
        return res.status(400).json({ message: "Server Error" });
    }
});
exports.getAllIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const income = yield prisma.income.findMany();
        return res.status(200).json({ income });
    }
    catch (error) {
        return res.status(400).json({ message: "Server Error" });
    }
});
exports.getIncomeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const income = yield prisma.income.findUnique({
            where: { id: id }
        });
        return res.status(200).json({ income });
    }
    catch (error) {
        return res.status(400).json({ message: "Server Error" });
    }
});
