import React from 'react';

/**
 * IssueList component renders a category of issues (bugs, improvements, etc.)
 * 
 * @param {string} title - The section title
 * @param {Array} items - List of issue objects { issue, fix }
 * @param {string} type - The type of issue (bug, improvement, performance) for styling
 */
const IssueList = ({ title, items, type }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="issue-section">
      <h3 className="section-title">
        {type === 'bug' && '🐛'}
        {type === 'performance' && '⚡'}
        {type === 'improvement' && '✨'}
        {type === 'issue' && '⚠️'}
        {title}
      </h3>
      {items.map((item, index) => (
        <div key={index} className={`issue-item ${type}`}>
          <p className="issue-desc">{item.issue}</p>
          <p className="issue-fix">
            <strong>Suggested Fix:</strong> {item.fix}
          </p>
        </div>
      ))}
    </div>
  );
};

export default IssueList;
