import React from 'react';
import IssueList from './IssueList';

/**
 * ReviewResult component displays the AI feedback once available.
 * 
 * @param {object} result - The response data from the backend
 */
const ReviewResult = ({ result }) => {
  if (!result || !result.data) return null;

  const { suggestions, responseTime, model, language } = result.data;
  const score = suggestions.score;

  // Determine score badge color
  const getScoreClass = (s) => {
    if (s >= 8) return 'score-high';
    if (s >= 5) return 'score-mid';
    return 'score-low';
  };

  return (
    <div className="card">
      <div className={`score-badge ${getScoreClass(score)}`}>
        Overall Score: {score}/10
      </div>

      <IssueList title="Critical Bugs" items={suggestions.bugs} type="bug" />
      <IssueList title="Security & Logic Issues" items={suggestions.issues} type="issue" />
      <IssueList title="Performance Optimizations" items={suggestions.performance} type="performance" />
      <IssueList title="Improvements & Best Practices" items={suggestions.improvements} type="improvement" />

      {suggestions.refactored_code && (
        <div className="refactor-section">
          <h3 className="section-title">🛠️ Refactored Code</h3>
          <div className="refactored-code-container">
            <pre>
              <code>{suggestions.refactored_code}</code>
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
