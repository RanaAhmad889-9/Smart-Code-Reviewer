import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { Issue, AnalysisSummary, IssueType } from '../../types';

let issueCounter = 0;

function makeId(): string {
  return `issue_${++issueCounter}_${Date.now()}`;
}

// Check if a name is "bad" - too short or non-descriptive
function isBadName(name: string): boolean {
  const ignoredNames = ['i', 'j', 'k', 'x', 'y', 'z', 'e', '_', 'cb', 'fn'];
  if (ignoredNames.includes(name)) return false; // common loop vars are fine
  if (name.length <= 1) return true;
  if (name.length === 2 && /^[a-z]{2}$/.test(name) && !['id', 'to', 'fs', 'db', 'el', 'fn', 'cb', 'ok', 'ok'].includes(name)) return true;
  // single letters used as variable names (not loop counters)
  return false;
}

// Calculate nesting depth of a node
function getNestingDepth(path: any): number {
  let depth = 0;
  let current = path.parent;
  while (current) {
    if (
      t.isIfStatement(current) ||
      t.isForStatement(current) ||
      t.isWhileStatement(current) ||
      t.isForInStatement(current) ||
      t.isForOfStatement(current) ||
      t.isSwitchStatement(current)
    ) {
      depth++;
    }
    current = current.parent;
  }
  return depth;
}

export function analyzeCode(code: string, language: string): { issues: Issue[]; summary: AnalysisSummary } {
  const issues: Issue[] = [];
  issueCounter = 0;

  const isTypeScript = language === 'typescript' || language === 'ts';

  let ast: any;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: isTypeScript ? ['typescript', 'jsx', 'decorators-legacy'] : ['jsx'],
      errorRecovery: true,
    });
  } catch (err) {
    // If parsing fails, return a single parse error issue
    return {
      issues: [{
        id: makeId(),
        type: 'complexity',
        severity: 'error',
        line: 1,
        message: 'Code could not be parsed',
        explanation: 'The code contains syntax errors that prevent analysis.',
        suggestion: 'Fix syntax errors before running analysis.',
      }],
      summary: buildSummary([{
        id: makeId(),
        type: 'complexity',
        severity: 'error',
        line: 1,
        message: 'Parse error',
        explanation: '',
        suggestion: '',
      }]),
    };
  }

  // Track declared and used variables for unused variable detection
  const declaredVars: Map<string, { line: number; used: boolean }> = new Map();

  traverse(ast, {
    // ── 1. Console.log detection ──────────────────────────────────────────
    CallExpression(path) {
      const callee = path.node.callee;
      if (
        t.isMemberExpression(callee) &&
        t.isIdentifier(callee.object, { name: 'console' }) &&
        t.isIdentifier(callee.property)
      ) {
        const line = path.node.loc?.start.line ?? 0;
        issues.push({
          id: makeId(),
          type: 'console_log',
          severity: 'warning',
          line,
          message: `console.${callee.property.name}() left in code`,
          explanation: 'Console statements are typically debug artifacts. They can expose sensitive data in production and clutter the output.',
          suggestion: 'Remove console statements or use a proper logging library (e.g., winston, pino) that can be toggled by environment.',
          code_snippet: `console.${callee.property.name}(...)`,
        });
      }
    },

    // ── 2. Variable declaration tracking ─────────────────────────────────
    VariableDeclarator(path) {
      if (t.isIdentifier(path.node.id)) {
        const name = path.node.id.name;
        const line = path.node.loc?.start.line ?? 0;
        declaredVars.set(name, { line, used: false });

        // Bad naming check
        if (isBadName(name)) {
          issues.push({
            id: makeId(),
            type: 'bad_naming',
            severity: 'info',
            line,
            message: `Variable "${name}" has a non-descriptive name`,
            explanation: 'Short or cryptic variable names make code harder to understand. Good names communicate intent.',
            suggestion: `Rename "${name}" to something descriptive like "userData", "itemCount", or "isLoading".`,
            code_snippet: `let ${name} = ...`,
          });
        }
      }
    },

    // ── 3. Track variable usage ───────────────────────────────────────────
    ReferencedIdentifier(path) {
      const name = path.node.name;
      if (declaredVars.has(name)) {
        declaredVars.get(name)!.used = true;
      }
    },

    // ── 4. Function length / complexity ──────────────────────────────────
    'FunctionDeclaration|FunctionExpression|ArrowFunctionExpression'(path: any) {
      const node = path.node;
      const body = node.body;
      if (!body || !t.isBlockStatement(body)) return;

      const startLine = node.loc?.start.line ?? 0;
      const endLine = node.loc?.end.line ?? 0;
      const lineCount = endLine - startLine;

      // Function name for display
      let funcName = 'anonymous';
      if (t.isFunctionDeclaration(node) && node.id) {
        funcName = node.id.name;
      } else if (
        t.isVariableDeclarator(path.parent) &&
        t.isIdentifier(path.parent.id)
      ) {
        funcName = path.parent.id.name;
      }

      if (lineCount > 40) {
        issues.push({
          id: makeId(),
          type: 'long_function',
          severity: 'warning',
          line: startLine,
          message: `Function "${funcName}" is ${lineCount} lines long`,
          explanation: `Functions over 40 lines are hard to understand, test, and maintain. This function is ${lineCount} lines.`,
          suggestion: `Break "${funcName}" into smaller, single-responsibility functions. Aim for functions under 20–30 lines.`,
          code_snippet: `function ${funcName}() { /* ${lineCount} lines */ }`,
        });
      }

      // Bad function naming
      if (
        t.isFunctionDeclaration(node) &&
        node.id &&
        isBadName(node.id.name)
      ) {
        issues.push({
          id: makeId(),
          type: 'bad_naming',
          severity: 'info',
          line: startLine,
          message: `Function "${node.id.name}" has a non-descriptive name`,
          explanation: 'Function names should describe what the function does using a verb.',
          suggestion: `Rename to something like "fetchUserData", "calculateTotal", or "handleSubmit".`,
        });
      }
    },

    // ── 5. Deep nesting detection ─────────────────────────────────────────
    IfStatement(path) {
      let depth = 0;
      let current: any = path;
      while (current.parentPath) {
        const parent = current.parentPath.node;
        if (
          t.isIfStatement(parent) ||
          t.isForStatement(parent) ||
          t.isWhileStatement(parent) ||
          t.isForInStatement(parent) ||
          t.isForOfStatement(parent)
        ) {
          depth++;
        }
        current = current.parentPath;
      }

      if (depth >= 3) {
        const line = path.node.loc?.start.line ?? 0;
        // Only report once per nesting depth (avoid duplication)
        const alreadyReported = issues.some(
          (i) => i.type === 'deep_nesting' && Math.abs(i.line - line) < 3
        );
        if (!alreadyReported) {
          issues.push({
            id: makeId(),
            type: 'deep_nesting',
            severity: 'warning',
            line,
            message: `Deep nesting detected (${depth + 1} levels deep)`,
            explanation: `Code nested ${depth + 1} levels deep is hard to follow. Deep nesting is a sign the logic should be refactored.`,
            suggestion: 'Use early returns (guard clauses), extract nested logic into functions, or use array methods like .filter() and .map().',
          });
        }
      }
    },

    // ── 6. Nested loops ───────────────────────────────────────────────────
    ForStatement(path) {
      const parent = path.parentPath?.node;
      if (
        parent &&
        (t.isForStatement(parent) ||
          t.isWhileStatement(parent) ||
          t.isForInStatement(parent) ||
          t.isForOfStatement(parent))
      ) {
        const line = path.node.loc?.start.line ?? 0;
        const alreadyReported = issues.some(
          (i) => i.type === 'complexity' && Math.abs(i.line - line) < 3
        );
        if (!alreadyReported) {
          issues.push({
            id: makeId(),
            type: 'complexity',
            severity: 'warning',
            line,
            message: 'Nested loop detected',
            explanation: 'Nested loops create O(n²) or worse time complexity. This can cause performance issues with large datasets.',
            suggestion: 'Consider using a Map/Set for lookups, or refactor with array methods. Extract the inner loop into a helper function.',
          });
        }
      }
    },
  });

  // ── 7. Report unused variables ────────────────────────────────────────
  for (const [name, info] of declaredVars.entries()) {
    if (!info.used && !name.startsWith('_')) {
      issues.push({
        id: makeId(),
        type: 'unused_variable',
        severity: 'warning',
        line: info.line,
        message: `Variable "${name}" is declared but never used`,
        explanation: 'Unused variables add noise to the code, increase cognitive load, and may indicate incomplete logic.',
        suggestion: `Remove "${name}" if it is not needed, or prefix with "_" (e.g., "_${name}") to signal it is intentionally unused.`,
        code_snippet: `let ${name} = ...`,
      });
    }
  }

  // Sort issues by line number
  issues.sort((a, b) => a.line - b.line);

  const summary = buildSummary(issues);
  return { issues, summary };
}

function buildSummary(issues: Issue[]): AnalysisSummary {
  const errors = issues.filter((i) => i.severity === 'error').length;
  const warnings = issues.filter((i) => i.severity === 'warning').length;
  const infos = issues.filter((i) => i.severity === 'info').length;

  // Score calculation:
  // Start at 100, subtract points per issue weighted by severity
  let score = 100;
  score -= errors * 15;
  score -= warnings * 7;
  score -= infos * 3;
  score = Math.max(0, Math.min(100, score));

  // Readability: penalizes bad naming and deep nesting
  const readabilityIssues = issues.filter((i) =>
    ['bad_naming', 'deep_nesting'].includes(i.type)
  ).length;
  const readabilityScore = Math.max(0, 100 - readabilityIssues * 10);

  // Maintainability: penalizes long functions, complexity, unused vars
  const maintainabilityIssues = issues.filter((i) =>
    ['long_function', 'complexity', 'unused_variable'].includes(i.type)
  ).length;
  const maintainabilityScore = Math.max(0, 100 - maintainabilityIssues * 12);

  return {
    total_issues: issues.length,
    errors,
    warnings,
    infos,
    readability_score: readabilityScore,
    maintainability_score: maintainabilityScore,
    overall_score: score,
  };
}
