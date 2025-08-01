import express from 'express'
import {registerUser,loginUser,getUser, deleteUser} from '../controllers/auth.controller.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/getUser',protect,getUser)

router.delete('/:id',protect,deleteUser)






export default router