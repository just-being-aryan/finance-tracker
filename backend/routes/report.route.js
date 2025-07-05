import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { generateMonthlyReport, getRecentReports, getCategorySpending,getTopPaymentMethods, getMonthlyTrend} from '../controllers/report.controller.js';

const router = express.Router();

router.post('/generate', protect, generateMonthlyReport);
router.get('/recent', protect, getRecentReports);
router.get('/categorySpending', protect, getCategorySpending)
router.get('/topMethods', protect, getTopPaymentMethods)
router.get('/trend', protect, getMonthlyTrend)


export default router;
