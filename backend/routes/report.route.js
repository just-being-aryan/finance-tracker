import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { generateMonthlyReport, getRecentReports} from '../controllers/report.controller.js';

const router = express.Router();

router.post('/generate', protect, generateMonthlyReport);
router.get('/recent', protect, getRecentReports);
export default router;
