import {asyncHandler} from '../utils/asyncHandler.js'
import {User} from '../models/user.model.js'
import { ApiError } from '../utils/apiError.js'
import { Expense } from '../models/expense.model.js'



export const addExpense = asyncHandler( async(req,res) => {

    const {amount,category,date,paymentMethod,notes}  = req.body


    if(!amount || !category || !date || !paymentMethod) {
        
        throw new ApiError(401,'Amount, category, date and paymentMethod are required fields!')

    }
    

    const createExpense = await Expense.create({
        user : req.user._id,
        amount,
        category,
        date,
        paymentMethod,
        notes
        
    })


    return res.status(201)
    .json({
        success : true,
        message : "Expense Created Successfully",createExpense
    })

})


export const getExpense = asyncHandler ( async (req,res) => {
    
    const {category, paymentMethod,startDate,endDate,search} = req.query;

    // Filters only expenses that belong to the logged-in user
    const filter = {
        user : req.user._id
    }

    //Category Filter

    if(category) {
        filter.category = category
    }

    //payment method

    if(paymentMethod) {
        filter.paymentMethod = paymentMethod
    }

    //adding date range filters

    if(startDate || endDate) {
        filter.date = {};
        if(startDate) filter.date.$gte = new Date(startDate)
        if(endDate) filter.date.$lte = new Date(endDate)
    }

    // Performs a case-insensitive partial search in the notes field

   if (search) {
        filter.$or = [
            { notes: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
            { paymentMethod: { $regex: search, $options: 'i' } },
        ];
    }
     // Fetches all matching expenses and Sorts them with newest date first


    const expenses = await Expense.find(filter).sort({date : -1})

    res.status(200)
    .json({
        success : true,
        message : "Expenses Fetched Successfully",
        count : expenses.length, expenses
    })

})


export const updateExpense = asyncHandler ( async (req,res) => {
    

    const expense = await Expense.findById(req.params.id)

    if(!expense) {
        throw new ApiError(404,'Expense not found')
    }

    if(expense.user.toString() !== req.user._id.toString() ){
        throw new ApiError(403,'Unauthorized')
    } 

    //Here i used?? instead of || so that 0 or empty strings don’t get skipped unintentionally.


    expense.amount = req.body.amount ?? expense.amount
    expense.category = req.body.category ?? expense.category;
    expense.date = req.body.date ?? expense.date;
    expense.paymentMethod = req.body.paymentMethod ?? expense.paymentMethod;
    expense.notes = req.body.notes ?? expense.notes;

    const updatedExpense = await expense.save();

    res.status(200)
    .json({
        success : true,
        message: "Expense updated Successfully",
        expense : updatedExpense
    })


})



export const deleteExpense = asyncHandler( async(req,res) => {
    
    const expense = await Expense.findById(req.params.id)

    if(!expense) {
        throw new ApiError(404,'Expense does not exists')
    }

    if(expense.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403,'Unauthorized to delete this expense')
    }

    await expense.deleteOne()

    res.status(200).json({
        success : true,
        message : "Expense deleted successfully"
    })
 
})