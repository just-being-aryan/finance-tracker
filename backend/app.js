import express from 'express'
import cors from 'cors'

const app = express()

//Middleware

app.use(cors())
app.use(express.json()) 

app.get('/', (req,res) => {
    res.send('API is running')
})


//More Routes soon

export default app