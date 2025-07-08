import mongoose from 'mongoose'
import dotenv from 'dotenv'

import pg from 'pg'

dotenv.config()


const { Pool } = pg;

//mongodb connection

export const connectMonogDB = async () => {
    try {
        
       await mongoose.connect(process.env.MONGO_URL)
       console.log("MongoDB connected successfully !")

    } catch (error) {
        console.error("MongoDB Conection Failed", error.message)
        // process.exit(1)
    }
} 


//Postgress connection

export const pgPool = new Pool(
    {
          host: process.env.POSTGRES_HOST,
          port: process.env.POSTGRES_PORT,
          database: process.env.POSTGRES_DB,
          user: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
        //   ssl: {
        //     rejectUnauthorized: false,
        // }

    }
)