"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authenticateJwt = require("../middleware/auth");
const expenseController = require("../controllers/expense");
const expenseInsights = require("../controllers/expenseInsight");
router.post('/create', authenticateJwt, expenseController.createExpense);
router.get('/getall', expenseController.getAllExpense);
router.get('/', authenticateJwt, expenseController.getAllExpensesByuserId);
router.get('/category', authenticateJwt, expenseController.expenseCategory);
router.put('/:id', authenticateJwt, expenseController.updateExpense);
router.delete('/:id', authenticateJwt, expenseController.deleteExpense);
router.get('/total-expense', authenticateJwt, expenseController.calculateTotal);
module.exports = router;
