

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
      <h3 className="section-title">
        {type === 'bug' && '🐛'}
        {type === 'performance' && '⚡'}
        {type === 'improvement' && '✨'}
        {type === 'issue' && '⚠️'}
        {title}
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
          ✓ No issues found in this category

        </p>
      )}
    </div>
  );
};

export default IssueList;
