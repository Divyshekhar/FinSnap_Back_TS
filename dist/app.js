"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://finsnap.vercel.app",
    credentials: true
}));
app.get('/health', (req, res) => {
    res.status(200).json({
        message: "Server is up"
    });
});
app.use('/expense', expenseRoutes);
app.use('/user', userRoutes);
app.use('/income', incomeRoutes);
app.listen(PORT || 5000, () => {
    console.log(`Server is running on PORT : ${PORT}`);
});
