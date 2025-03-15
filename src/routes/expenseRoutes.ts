import express from "express";
const router = express.Router();
const authenticateJwt = require("../middleware/auth")
const expenseController = require("../controllers/expense");
const expenseInsights = require("../controllers/expenseInsight");
router.post('/create', authenticateJwt, expenseController.createExpense);
router.get('/getall', expenseController.getAllExpense);
router.get('/', authenticateJwt, expenseController.getAllExpensesByuserId);
router.get('/category', authenticateJwt,expenseController.expenseCategory);
router.put('/:id', authenticateJwt, expenseController.updateExpense);
router.delete('/:id', authenticateJwt, expenseController.deleteExpense);
router.get('/total-expense', authenticateJwt, expenseController.calculateTotal);
router.get('/history/:category', authenticateJwt, expenseController.getExpenseHistory);

module.exports = router;