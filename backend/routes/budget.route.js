import express from 'express'
import {createOrUpdateBudget, getBudget,getBudgetAlerts, deleteBudget,getDashboardStats, getAllBudgets} from '../controllers/budget.controller.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()


router.post('/createOrUpdateBudget',protect, createOrUpdateBudget)
router.get('/', protect, getBudget)
router.get('/getBudgetAlerts', protect,getBudgetAlerts)
router.get('/getAllBudgets',protect,getAllBudgets)
router.get('/dashboardStats', protect, getDashboardStats)
router.delete('/:id', protect, deleteBudget)

export default router;