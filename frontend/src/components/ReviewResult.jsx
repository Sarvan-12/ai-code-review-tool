import { useState } from 'react';
import IssueList from './IssueList';

/**
 * ReviewResult component displays the AI feedback once available.
 * 
 * @param {object} result - The response data from the backend
 */
const ReviewResult = ({ result }) => {
  const [copied, setCopied] = useState(false);
  if (!result || !result.data) return null;

  const handleCopy = () => {
    if (result.data.suggestions.refactored_code) {
      navigator.clipboard.writeText(
        formatRefactoredCode(result.data.suggestions.refactored_code, language)
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const { suggestions, responseTime, model, language } = result.data;
  const score = suggestions.score;
  console.log("RAW REFACTORED CODE:", suggestions.refactored_code);
  const formatRefactoredCode = (code) => {
    if (!code) return '';

    let formatted = code
      .replace(/```[a-zA-Z]*\n?/g, '')   // remove ```java etc
      .replace(/```/g, '')
      .replace(/\\r\\n/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '    ')
      .trim();

    // remove extra empty lines
    formatted = formatted.replace(/\n\s*\n/g, '\n');

    // apply formatting only for languages with braces
    if (/[{};]/.test(formatted)) {
      formatted = formatted
        .replace(/{/g, ' {\n')
        .replace(/}/g, '\n}\n')
        .replace(/;/g, ';\n');
    }

    // indentation logic
    let indent = 0;
    formatted = formatted
      .split('\n')
      .map((line) => {
        let trimmed = line.trim();

        if (trimmed.startsWith('}')) indent--;

        let result = '  '.repeat(Math.max(indent, 0)) + trimmed;

        if (trimmed.endsWith('{')) indent++;

        return result;
      })
      .join('\n');

    return formatted;
  };
  // indentation logic
  
// Determine score badge color
const getScoreClass = (s) => {

  if (s >= 8) return 'score-high';
  if (s >= 5) return 'score-mid';
  return 'score-low';
};

return (
  <div className="card">
    <div className="score-container">
      <p className="score-label">Code Quality Score</p>
      <div className={`score-badge ${getScoreClass(score)}`}>
        {score * 10}/100
      </div>
    </div>


    <IssueList title="Critical Bugs" items={suggestions.bugs} type="bug" />
    <IssueList title="Security & Logic Issues" items={suggestions.issues} type="issue" />
    <IssueList title="Performance Optimizations" items={suggestions.performance} type="performance" />
    <IssueList title="Improvements & Best Practices" items={suggestions.improvements} type="improvement" />

    {suggestions.refactored_code && (
      <div className="refactor-section">
        <h3 className="section-title">🛠️ Refactored Code</h3>
        <div className="refactored-code-container">
          <button
            className="btn-copy"
            onClick={handleCopy}
            title="Copy code to clipboard"
          >
            {copied ? '✅ Copied!' : '📋 Copy Code'}
          </button>
          <pre className="code-block">
            <code>
              {formatRefactoredCode(suggestions.refactored_code)}
            </code>
          </pre>
        </div>
      </div>
    )}
    <div className="meta-info">
      <span><strong>Language:</strong> {language}</span>
      <span><strong>Model:</strong> {model}</span>
      <span><strong>Response Time:</strong> {responseTime}ms</span>
    </div>
  </div>
);
};

export default ReviewResult;
