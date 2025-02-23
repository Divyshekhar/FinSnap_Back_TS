"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const cors = require('cors');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors());
app.get('/health', (req, res) => {
    res.status(200).json({
        message: "Server is up"
    });
});
app.use('/expense', expenseRoutes);
app.use('/user', userRoutes);
app.use('/income', incomeRoutes);
app.listen(5000, () => {
    console.log("Server is running on PORT : 5000");
});
