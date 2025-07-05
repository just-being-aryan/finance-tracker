import { Expense } from '../models/expense.model.js'
import { Budget } from '../models/budget.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { pgPool } from '../config/db.js'

export const generateMonthlyReport = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

  // Get all expenses for the current month
  const expenses = await Expense.find({
    user: userId,
    date: {
      $gte: new Date(`${currentMonth}-01`),
      $lt: new Date(`${currentMonth}-31`),
    },
  });

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categorySpend = {};
  for (const exp of expenses) {
    categorySpend[exp.category] = (categorySpend[exp.category] || 0) + exp.amount;
  }

  const topCategory = Object.entries(categorySpend)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const budgets = await Budget.find({ user: userId, month: currentMonth });

  const overbudgetCategories = budgets
    .filter(b => categorySpend[b.category] > b.limit)
    .map(b => b.category);

  // Save to PostgreSQL using your pgPool
  await pgPool.query(
    `INSERT INTO monthly_reports (user_id, month, total_spent, top_category, overbudget_categories)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, currentMonth, totalSpent, topCategory, overbudgetCategories]
  );

  res.status(201).json({
    success: true,
    message: 'Monthly report generated and saved successfully!',
  });
});




export const getRecentReports = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  // Get current month and compute last 3 months in YYYY-MM format
  const currentDate = new Date();
  const months = [];

  for (let i = 0; i < 3; i++) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const formatted = d.toISOString().slice(0, 7); // "YYYY-MM"
    months.push(formatted);
  }

  const query = `
    SELECT * FROM monthly_reports
    WHERE user_id = $1 AND month = ANY($2)
    ORDER BY month DESC;
  `;

  const result = await pgPool.query(query, [userId, months]);

  res.status(200).json({
    success: true,
    message: 'Last 3 monthly reports fetched successfully',
    reports: result.rows,
  });
});

export const getCategorySpending = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString()
  const currentMonth = new Date().toISOString().slice(0, 7)

  const expenses = await Expense.find({
    user: userId,
    date: {
      $gte: new Date(`${currentMonth}-01`),
      $lt: new Date(`${currentMonth}-31`),
    },
  })

  const categorySpending = {}
  for (const exp of expenses) {
    categorySpending[exp.category] = (categorySpending[exp.category] || 0) + exp.amount
  }

  res.status(200).json({ categorySpending })
})

export const getTopPaymentMethods = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString()
  const currentMonth = new Date().toISOString().slice(0, 7)

  const expenses = await Expense.find({
    user: userId,
    date: {
      $gte: new Date(`${currentMonth}-01`),
      $lt: new Date(`${currentMonth}-31`),
    },
  })

  const methodCount = {}
  for (const exp of expenses) {
    methodCount[exp.paymentMethod] = (methodCount[exp.paymentMethod] || 0) + 1
  }

  const topMethods = Object.entries(methodCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([method]) => method)

  res.status(200).json({ topMethods })
})


export const getMonthlyTrend = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString()
  const expenses = await Expense.find({ user: userId })

  const monthlyTotals = {}

  for (const exp of expenses) {
    const month = exp.date.toISOString().slice(0, 7)
    monthlyTotals[month] = (monthlyTotals[month] || 0) + exp.amount
  }

  const sorted = Object.entries(monthlyTotals)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, total]) => ({ month, total }))

  res.status(200).json({ trend: sorted })
})
