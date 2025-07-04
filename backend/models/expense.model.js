import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
        },

        amount : {
            type : Number,
            required : [true, 'Amount is required']
        },
    
        category : {
            type : String,
            required : [true,'Category is required'],
            enum : ['Food', "Rent", "Healthcare", "Shopping", "EMIs", "Travel", "other"]
        },

        date : {
            type : Date,
            required : [true, 'Date is required']
        },
        
        paymentMethod : {
            type : String,
            required : true,
            enum : ['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking']
        },

        notes : {
            type : String,
            default : ''
        }



    },
    {timestamps : true}
)

export const Expense = mongoose.model('Expense',expenseSchema)