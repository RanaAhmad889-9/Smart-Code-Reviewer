export interface User {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  role: 'USER' | 'ADMIN';
  created_at: Date;
}

export interface Analysis {
  id: number;
  user_id: number | null;
  code: string;
  language: string;
  score: number;
  issues: Issue[];
  summary: AnalysisSummary;
  created_at: Date;
}

export interface Issue {
  id: string;
  type: IssueType;
  severity: 'error' | 'warning' | 'info';
  line: number;
  column?: number;
  message: string;
  explanation: string;
  suggestion: string;
  code_snippet?: string;
}

export type IssueType =
  | 'unused_variable'
  | 'long_function'
  | 'deep_nesting'
  | 'console_log'
  | 'bad_naming'
  | 'complexity';

export interface AnalysisSummary {
  total_issues: number;
  errors: number;
  warnings: number;
  infos: number;
  readability_score: number;
  maintainability_score: number;
  overall_score: number;
}

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}
