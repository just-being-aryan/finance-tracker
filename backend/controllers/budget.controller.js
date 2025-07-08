import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'
import { Expense } from '../models/expense.model.js'
import { Budget } from '../models/budget.model.js'

// CREATE or UPDATE BUDGET
export const createOrUpdateBudget = asyncHandler(async (req, res) => {
  const { name, month, limit, budgetId } = req.body

  if (!name || !limit) {
    throw new ApiError(400, 'Budget Name and Limit are required fields!')
  }

  if (isNaN(limit)) {
    throw new ApiError(400, 'Limit must be a number')
  }

  const formattedMonth = month || new Date().toISOString().slice(0, 7)
  let budget
  let existingBudget = null

  if (budgetId) {
    existingBudget = await Budget.findById(budgetId)
    if (!existingBudget) {
      throw new ApiError(404, 'Budget not found')
    }
    if (existingBudget.user.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Unauthorized to update this budget')
    }

    existingBudget.name = name
    existingBudget.limit = limit
    existingBudget.month = formattedMonth
    budget = await existingBudget.save()
  } else {
    const duplicateBudget = await Budget.findOne({
      user: req.user._id,
      name,
      month: formattedMonth,
    })

    if (duplicateBudget) {
      throw new ApiError(409, 'Budget with this name and month already exists')
    }

    budget = await Budget.create({
      user: req.user._id,
      name,
      limit,
      month: formattedMonth,
    })
  }

  res.status(200).json({
    success: true,
    message: existingBudget ? 'Budget updated successfully' : 'Budget created successfully',
    budget,
  })
})

// GET ALL BUDGETS WITH SPENDING DETAILS
export const getBudget = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString()

  const budgets = await Budget.find({ user: userId })

  const enrichedBudgets = await Promise.all(
    budgets.map(async (budget) => {
      const expenses = await Expense.find({
        user: userId,
        budget: budget._id,
      })

      const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)

      return {
        ...budget._doc,
        spent: totalSpent,
        remaining: budget.limit - totalSpent,
      }
    })
  )

  res.status(200).json({
    success: true,
    message: 'Budget fetched successfully',
    budget: enrichedBudgets,
  })
})

// GET ALL BUDGETS FOR DROPDOWN (IN EXPENSE FORM)
export const getAllBudgets = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString()

  const budgets = await Budget.find({ user: userId }).select('_id name month limit')

  res.status(200).json({
    success: true,
    message: 'All budgets fetched successfully',
    budgets,
  })
})

// GET ALERTS BASED ON SPENDING
export const getBudgetAlerts = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ user: req.user._id })

  if (!budgets || budgets.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No budgets found for this user',
      alerts: []
    })
  }

  const alerts = []

  for (const budget of budgets) {
    const startDate = new Date(`${budget.month}-01`)
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + 1)

    const expenseAgg = await Expense.aggregate([
      {
        $match: {
          user: budget.user,
          budget: budget._id,
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' },
        },
      },
    ])

    const totalSpent = expenseAgg[0]?.totalSpent || 0
    const usagePercent = (totalSpent / budget.limit) * 100

    let status = 'under'
    if (usagePercent >= 100) status = 'overbudget'
    else if (usagePercent >= 80) status = 'warning'

    alerts.push({
      name: budget.name,
      month: budget.month,
      budget: budget.limit,
      spent: totalSpent,
      usagePercent: Math.round(usagePercent),
      status,
    })
  }

  res.status(200).json({
    success: true,
    message: 'Budget alerts generated successfully',
    alerts,
  })
})

// DASHBOARD STATS
export const getDashboardStats = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ user: req.user._id })
  const expenses = await Expense.find({ user: req.user._id })

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const numberOfBudgets = budgets.length

  res.status(200).json({
    totalBudget,
    totalSpent,
    numberOfBudgets
  })
})




export const deleteBudget = asyncHandler(async (req, res) => {
  const budgetId = req.params.id
  
  const budget = await Budget.findById(budgetId)
  
  if (!budget) {
    throw new ApiError(404, 'Budget not found')
  }
  
  if (budget.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Unauthorized to delete this budget')
  }
  
  await budget.deleteOne()
  
  res.status(200).json({
    success: true,
    message: 'Budget deleted successfully'
  })
})