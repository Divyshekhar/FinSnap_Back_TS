import express from 'express';
const router = express.Router();
const incomeController = require("../controllers/income");
const authenticateJwt = require("../middleware/auth")

router.get('/', incomeController.getAllIncome);
router.post('/create', authenticateJwt, incomeController.createIncome);
router.get('/category', authenticateJwt, incomeController.incomeCategory);
router.put('/:id', authenticateJwt, incomeController.updateIncome);
router.delete('/delete/:id', authenticateJwt, incomeController.deleteIncome);
router.get('/total-income', authenticateJwt, incomeController.calculateTotal);
router.get('/history/:category', authenticateJwt, incomeController.getIncomeHistory);
module.exports = router;