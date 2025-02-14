import express from "express";
const router = express.Router();
const expenseController = require("../controllers/expense");

router.post('/add', expenseController.createExpense);
router.get('/', expenseController.getAllExpense);
router.get('/:id', expenseController.getExpenseById);

module.exports = router;