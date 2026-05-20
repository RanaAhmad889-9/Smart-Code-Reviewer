import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './models/db';
import authRoutes from './routes/auth';
import analysisRoutes from './routes/analysis';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/analyses', analysisRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;

async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
  });
}

start().catch(console.error);

export default app;
