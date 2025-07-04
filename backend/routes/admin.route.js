import express from 'express'
import { isAdmin } from '../middleware/adminMiddleware.js'
import { protect } from '../middleware/authMiddleware.js'
import { getAllUsersSpending } from '../controllers/admin.controller.js'

const router = express.Router()

router.get('/all-users-spending',protect,isAdmin,getAllUsersSpending)


export default router