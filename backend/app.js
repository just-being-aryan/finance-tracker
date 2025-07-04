import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.route.js'
import { errorMiddleware } from './middleware/errorMiddleware.js'
import expenseRoutes from './routes/expense.route.js'
const app = express()

//Middleware

app.use(cors())
app.use(express.json()) 

app.use('/api/users', authRoutes)
app.use('/api/expenses',expenseRoutes)

app.get('/', (req,res) => {
    res.send('API is running')
})


app.use(errorMiddleware)



//More Routes soon

export default app