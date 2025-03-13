"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const incomeController = require("../controllers/income");
const authenticateJwt = require("../middleware/auth");
router.get('/', incomeController.getAllIncome);
router.post('/create', authenticateJwt, incomeController.createIncome);
router.get('/category', authenticateJwt, incomeController.incomeCategory);
router.put('/:id', authenticateJwt, incomeController.updateIncome);
router.delete('/:id', authenticateJwt, incomeController.deleteIncome);
router.get('/total-income', authenticateJwt, incomeController.calculateTotal);
module.exports = router;
