import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import {connectMonogDB, pgPool} from './config/db.js'
import app from './app.js'


dotenv.config()

const PORT = process.env.PORT || 9000

const startServer = async() => {
    try {
        
        await connectMonogDB()


        try{
            await pgPool.query('SELECT NOW()');
            console.log("PostgreSQL connected successfully")
        }catch(pgErr) {
            console.error("❌ PostgreSQL connection failed:", pgErr.message);
        }

        

        app.listen(PORT, () => {
            console.log(`Server running on PORT ${PORT}`)
        })

    } catch (error) {
        console.error('Failed to start server', error.message)
        //  process.exit(1);
    }
}


startServer()