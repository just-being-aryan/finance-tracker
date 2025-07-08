import mongoose from 'mongoose'

const budgetSchema = new mongoose.Schema(
    {
        user :  {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        
        name : {
            type : String,
            required : [true,'Budget name is required']
        },

        month : {
            type : String,
            required : [true, 'Month is required']
        },
        limit : {
            type : Number,
            required : [true , 'Spending Limit is required']
        }
    },
    {timestamps : true}
)

export const Budget = mongoose.model('Budget',budgetSchema)