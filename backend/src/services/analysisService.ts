import { pool } from '../models/db';
import { analyzeCode } from '../utils/analyzer/codeAnalyzer';

export async function runAnalysis(code: string, language: string, userId?: number) {
  const { issues, summary } = analyzeCode(code, language);

  // Save to DB
  const result = await pool.query(
    `INSERT INTO analyses (user_id, code, language, score, issues, summary)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`,
    [userId || null, code, language, summary.overall_score, JSON.stringify(issues), JSON.stringify(summary)]
  );

  return {
    id: result.rows[0].id,
    created_at: result.rows[0].created_at,
    language,
    issues,
    summary,
    score: summary.overall_score,
  };
}

export async function getUserHistory(userId: number, limit = 20) {
  const result = await pool.query(
    `SELECT id, language, score, summary, created_at 
     FROM analyses WHERE user_id = $1 
     ORDER BY created_at DESC LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

export async function getAnalysisById(id: number, userId?: number) {
  const result = await pool.query(
    'SELECT * FROM analyses WHERE id = $1',
    [id]
  );
  if (result.rows.length === 0) return null;

  const analysis = result.rows[0];
  // Non-admin users can only see their own analyses
  if (userId && analysis.user_id && analysis.user_id !== userId) return null;

  return analysis;
}

export async function getAdminStats() {
  const total = await pool.query('SELECT COUNT(*) FROM analyses');
  const users = await pool.query('SELECT COUNT(*) FROM users');
  const avgScore = await pool.query('SELECT AVG(score) FROM analyses');
  const recent = await pool.query(
    `SELECT a.id, a.language, a.score, a.created_at, u.username
     FROM analyses a LEFT JOIN users u ON a.user_id = u.id
     ORDER BY a.created_at DESC LIMIT 10`
  );

  return {
    total_analyses: parseInt(total.rows[0].count),
    total_users: parseInt(users.rows[0].count),
    avg_score: Math.round(parseFloat(avgScore.rows[0].avg || '0')),
    recent_analyses: recent.rows,
  };
}
