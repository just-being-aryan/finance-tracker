import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {

        username : {
            type : String,
            required : [true,'Username is required']
        },

        email : {
            type : String,
            required : [true,'Email is required'],
            unique : true
        },

        password : {
            type : String,
            required : [true,'Password is required']
        },

        role : {
            type : String,
            enum : ["user", "admin"],
            default : "user"
        }

    }, 
    
    {timestamps : true})


export const User = mongoose.model('User',userSchema)