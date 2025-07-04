import express from 'express'
import { addExpense, getExpense,updateExpense,deleteExpense } from '../controllers/expense.controller.js'
import {protect} from '../middleware/authMiddleware.js'
const router = express.Router()


router.get('/getExpense',protect, getExpense)
router.post('/addExpense',protect,addExpense)

router.put('/:id',protect, updateExpense)
router.delete('/:id',protect, deleteExpense)

export default router