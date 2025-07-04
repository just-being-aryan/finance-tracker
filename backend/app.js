import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.route.js'
import { errorMiddleware } from './middleware/errorMiddleware.js'

const app = express()

//Middleware

app.use(cors())
app.use(express.json()) 

app.use('/api/users', authRoutes)

app.get('/', (req,res) => {
    res.send('API is running')
})


app.use(errorMiddleware)



//More Routes soon

export default app