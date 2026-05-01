import { Bug, Zap, Wand2, AlertTriangle, CheckCircle2 } from 'lucide-react';

/**
 * IssueList component renders a category of issues (bugs, improvements, etc.)
 * 
 * @param {string} title - The section title
 * @param {Array} items - List of issue objects { issue, fix }
 * @param {string} type - The type of issue (bug, improvement, performance) for styling
 */
const IssueList = ({ title, items, type }) => {
  const hasItems = items && items.length > 0;

  return (
    <div className="issue-section">
      <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {type === 'bug' && <Bug size={24} color="#ef4444" />}
        {type === 'performance' && <Zap size={24} color="#eab308" />}
        {type === 'improvement' && <Wand2 size={24} color="#3b82f6" />}
        {type === 'issue' && <AlertTriangle size={24} color="#f97316" />}
        <span>{title}</span>
      </h3>
      {hasItems ? (
        items.map((item, index) => (
          <div key={index} className={`issue-item ${type}`}>
            <p className="issue-desc">{item.issue}</p>
            <p className="issue-fix">
              <strong>Suggested Fix:</strong> {item.fix}
            </p>
          </div>
        ))
      ) : (
        <p className="empty-message">
          No {title.toLowerCase()} found.
          <CheckCircle2 size={16} style={{ display: 'inline', marginLeft: '4px', verticalAlign: 'text-bottom' }} /> No issues found in this category
        </p>
      )}
    </div>
  );
};

export default IssueList;
