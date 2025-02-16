import express from "express";
const router = express.Router();
const authenticateJwt = require("../middleware/auth")
const expenseController = require("../controllers/expense");

router.post('/add', expenseController.createExpense);
router.get('/getall', expenseController.getAllExpense);
router.get('/', authenticateJwt, expenseController.getAllExpensesByuserId);
router.put('/:id', authenticateJwt, expenseController.updateExpense);
router.delete('/:id', authenticateJwt, expenseController.deleteExpense)
module.exports = router;