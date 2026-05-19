import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { runAnalysis, getUserHistory, getAnalysisById, getAdminStats } from '../services/analysisService';

export async function analyze(req: AuthRequest, res: Response) {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const supportedLanguages = ['javascript', 'typescript', 'js', 'ts'];
    if (!supportedLanguages.includes(language.toLowerCase())) {
      return res.status(400).json({ error: 'Only JavaScript and TypeScript are supported' });
    }

    const result = await runAnalysis(code, language, req.user?.userId);
    res.json(result);
  } catch (err: any) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Analysis failed' });
  }
}

export async function getHistory(req: AuthRequest, res: Response) {
  try {
    const history = await getUserHistory(req.user!.userId);
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
}

export async function getAnalysis(req: AuthRequest, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const analysis = await getAnalysisById(id, req.user?.userId);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    res.json(analysis);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
}

export async function adminStats(req: AuthRequest, res: Response) {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
