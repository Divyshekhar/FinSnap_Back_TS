import express from 'express';
const router = express.Router();
const incomeController = require("../controllers/income");
const authenticateJwt = require("../middleware/auth")

router.get('/', incomeController.getAllIncome);
router.post('/create', authenticateJwt, incomeController.createIncome);
// router.get('/:id', incomeController.getAllIncomeById);
router.put('/:id', authenticateJwt, incomeController.updateIncome);
router.delete('/:id', authenticateJwt, incomeController.deleteIncome);
router.get('/total-income', authenticateJwt, incomeController.calculateTotal);
module.exports = router;