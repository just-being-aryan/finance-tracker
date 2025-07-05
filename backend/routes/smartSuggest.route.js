import express from 'express';
import { generateSmartSuggestions } from '../controllers/smartSuggest.controller.js';

const router = express.Router();

router.post('/smart-suggestions', generateSmartSuggestions);

export default router;
