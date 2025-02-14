"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const incomeController = require("../controllers/income");
router.get('/', incomeController.getAllIncome);
router.post('/create', incomeController.createIncome);
router.get('/:id', incomeController.getIncomeById);
module.exports = router;
