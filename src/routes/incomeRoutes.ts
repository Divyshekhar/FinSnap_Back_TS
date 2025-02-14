import express from 'express';
const router = express.Router();
const incomeController = require("../controllers/income");

router.get('/', incomeController.getAllIncome);
router.post('/create', incomeController.createIncome);
router.get('/:id', incomeController.getIncomeById);

module.exports = router;