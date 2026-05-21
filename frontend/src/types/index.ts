export interface Issue {
  id: string;
  type: string;
  severity: 'error' | 'warning' | 'info';
  line: number;
  message: string;
  explanation: string;
  suggestion: string;
  code_snippet?: string;
}

export interface AnalysisSummary {
  total_issues: number;
  errors: number;
  warnings: number;
  infos: number;
  readability_score: number;
  maintainability_score: number;
  overall_score: number;
}

export interface AnalysisResult {
  id: number;
  language: string;
  score: number;
  issues: Issue[];
  summary: AnalysisSummary;
  created_at: string;
}

export interface HistoryItem {
  id: number;
  language: string;
  score: number;
  summary: AnalysisSummary;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AnalysisState {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}
