import express from 'express';
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({
    origin: "https://finsnap.vercel.app/"
}
));

app.get('/health', (req, res) => {
    res.status(200).json({
        message: "Server is up"
    })
})
app.use('/expense', expenseRoutes)
app.use('/user', userRoutes);
app.use('/income', incomeRoutes);


app.listen(PORT || 5000, () => {
    console.log(`Server is running on PORT : ${PORT}`);
})