import express from "express";
const router = express.Router();
const authenticateJwt = require("../middleware/auth")
const expenseController = require("../controllers/expense");

router.post('/add', expenseController.createExpense);
router.get('/', expenseController.getAllExpense);
router.get('/', authenticateJwt, expenseController.getAllExpensesByuserId);

module.exports = router;