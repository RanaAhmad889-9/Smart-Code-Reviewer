import { Router } from 'express';
import { analyze, getHistory, getAnalysis, adminStats } from '../controllers/analysisController';
import { authMiddleware, optionalAuth, adminOnly } from '../middleware/auth';

const router = Router();

// Anyone can analyze (auth optional — saves to history if logged in)
router.post('/analyze', optionalAuth, analyze);

// Auth required for history
router.get('/history', authMiddleware, getHistory);
router.get('/:id', optionalAuth, getAnalysis);

// Admin only
router.get('/admin/stats', authMiddleware, adminOnly, adminStats);

export default router;
