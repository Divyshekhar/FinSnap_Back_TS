import express from 'express';
const expenseRoutes = require ('./routes/expenseRoutes');
const userRoutes = require ('./routes/userRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
    res.status(200).json({
        message: "Server is up"
    })
})
app.use('/expense', expenseRoutes)
app.use('/user', userRoutes);
app.use('/income', incomeRoutes);


app.listen(5000, () => {
    console.log("Server is running on PORT : 5000");
})
