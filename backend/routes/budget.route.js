import express from 'express'
import {createOrUpdateBudget, getBudget,getBudgetAlerts} from '../controllers/budget.controller.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()


router.post('/createOrUpdateBudget',protect, createOrUpdateBudget)
router.get('/', protect, getBudget)
router.get('/getBudgetAlerts', protect,getBudgetAlerts)


export default router;