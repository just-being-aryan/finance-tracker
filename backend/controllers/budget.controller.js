import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'
import { Expense } from '../models/expense.model.js'
import { Budget } from '../models/budget.model.js'

export const createOrUpdateBudget = asyncHandler(async (req, res) => {
  const { category, month, limit } = req.body

  if (!category || !limit) {
    throw new ApiError(400, 'Category and Limit are required fields!')
  }

  if (isNaN(limit)) {
    throw new ApiError(400, 'Limit must be a number')
  }

  const formattedMonth = month || new Date().toISOString().slice(0, 7)

  const existingBudget = await Budget.findOne({
    user: req.user._id,
    category,
    month: formattedMonth,
  })

  let budget

  if (existingBudget) {
    existingBudget.limit = limit
    budget = await existingBudget.save()
  } else {
    budget = await Budget.create({
      user: req.user._id,
      category,
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


export const getBudget = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const budgets = await Budget.find({ user: userId, month: currentMonth });

  // Calculate spent per category
  const enrichedBudgets = await Promise.all(
    budgets.map(async (budget) => {
      const expenses = await Expense.find({
        user: userId,
        category: budget.category,
        date: {
          $gte: new Date(`${currentMonth}-01`),
          $lt: new Date(`${currentMonth}-31`),
        },
      });

      const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

      return {
        ...budget._doc,
        spent: totalSpent,
      };
    })
  );

  res.status(200).json({
    success: true,
    message: 'Budget fetched successfully',
    budget: enrichedBudgets,
  });
});


export const getBudgetAlerts = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ user: req.user._id })

  if (!budgets || budgets.length === 0) {
    throw new ApiError(404, 'No budgets found for this user')
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
          category: budget.category,
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
      category: budget.category,
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
