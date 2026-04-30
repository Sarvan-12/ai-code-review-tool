/**
 * IssueList component renders a category of issues (bugs, improvements, etc.)
 */
const IssueList = ({ title, items, type }) => {
  const hasItems = items && items.length > 0;

  const getIcon = () => {
    switch(type) {
      case 'bug': return '🐛';
      case 'performance': return '⚡';
      case 'improvement': return '✨';
      case 'issue': return '⚠️';
      default: return '🔍';
    }
  };

  return (
    <div className="issue-section">
      <h3 className="issue-title">
        <span>{getIcon()}</span>
        {title}
      </h3>
      
      {hasItems ? (
        <div className="issue-list">
          {items.map((item, index) => (
            <div key={index} className={`issue-card ${type}`}>
              <div className="issue-text">
                {item.issue}
              </div>
              {item.fix && (
                <div className="issue-fix">
                  <strong>Fix:</strong> {item.fix}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-message">✓ No {title.toLowerCase()} found.</p>
      )}
    </div>
  );
};

export default IssueList;
