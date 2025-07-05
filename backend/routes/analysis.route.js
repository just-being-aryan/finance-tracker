import express from 'express'
import axios from 'axios'
import { protect } from '../middleware/authMiddleware.js'
import { Expense } from '../models/expense.model.js'


const router = express.Router()

router.post('/sendExpensesToPython', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })

    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: 'No expenses found to analyze' })
    }

    const payload = expenses.map(exp => ({
      category: exp.category,
      amount: exp.amount
    }))

    const pythonRes = await axios.post('http://127.0.0.1:5000/analyze', payload)

    res.json(pythonRes.data)

  } catch (err) {
    console.error('Failed to send data to Python service:', err.message)
    res.status(500).json({ message: 'Analysis failed' })
  }
})

export default router
