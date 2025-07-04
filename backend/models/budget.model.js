import mongoose from 'mongoose'

const budgetSchema = new mongoose.Schema(
    {
        user :  {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        category : {
            type : String,
            required : [true,'Category is required'],
           enum : ['Food', "Rent", "Healthcare", "Shopping", "EMIs", "Travel", "other"]
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