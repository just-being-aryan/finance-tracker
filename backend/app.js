import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.route.js'
import { errorMiddleware } from './middleware/errorMiddleware.js'
import expenseRoutes from './routes/expense.route.js'
import budgetRoutes from './routes/budget.route.js'
import adminRoutes from './routes/admin.route.js'
import reportRoutes from './routes/report.route.js';
import cookieParser from 'cookie-parser'
import smartSuggestRoutes from './routes/smartSuggest.route.js';


const app = express()

//Middleware

const allowedOrigins = [
  'http://localhost:3000',
  'https://finance-tracker-navy-omega.vercel.app'
]
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.use(cookieParser())


app.use(express.json()) 

app.use('/api/users', authRoutes)
app.use('/api/expenses',expenseRoutes)
app.use('/api/budget', budgetRoutes)
app.use('/api/adminRoutes',adminRoutes)

app.use('/api/reports', reportRoutes);

app.use('/api', smartSuggestRoutes);



app.get('/', (req,res) => {
    res.send('API is running')
})


app.use(errorMiddleware)



//More Routes soon

export default app