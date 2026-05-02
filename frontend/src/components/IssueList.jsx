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

  const getTypeStyles = (t) => {
    switch (t) {
      case 'bug': return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.05)', border: 'rgba(239, 68, 68, 0.2)' };
      case 'performance': return { color: '#eab308', bg: 'rgba(234, 179, 8, 0.05)', border: 'rgba(234, 179, 8, 0.2)' };
      case 'improvement': return { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.05)', border: 'rgba(59, 130, 246, 0.2)' };
      case 'issue': return { color: '#f97316', bg: 'rgba(249, 115, 22, 0.05)', border: 'rgba(249, 115, 22, 0.2)' };
      default: return { color: '#64748b', bg: 'rgba(100, 116, 139, 0.05)', border: 'rgba(100, 116, 139, 0.2)' };
    }
  };

  const styles = getTypeStyles(type);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h3 style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        fontSize: '0.95rem', 
        fontWeight: '700', 
        color: '#334155',
        marginBottom: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.025em'
      }}>
        {type === 'bug' && <Bug size={18} color={styles.color} />}
        {type === 'performance' && <Zap size={18} color={styles.color} />}
        {type === 'improvement' && <Wand2 size={18} color={styles.color} />}
        {type === 'issue' && <AlertTriangle size={18} color={styles.color} />}
        <span>{title}</span>
        <span style={{ 
          fontSize: '0.75rem', 
          backgroundColor: styles.bg, 
          color: styles.color, 
          padding: '2px 8px', 
          borderRadius: '100px',
          border: `1px solid ${styles.border}`
        }}>
          {hasItems ? items.length : 0}
        </span>
      </h3>

      {hasItems ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((item, index) => (
            <div 
              key={index} 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                padding: '1.25rem',
                border: `1px solid ${styles.border}`,
                transition: 'transform 0.2s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <p style={{ 
                margin: '0 0 0.75rem 0', 
                color: '#1e293b', 
                fontSize: '0.95rem', 
                lineHeight: '1.5',
                fontWeight: '500'
              }}>
                {item.issue}
              </p>
              <div style={{ 
                backgroundColor: styles.bg, 
                padding: '0.75rem 1rem', 
                borderRadius: '8px',
                borderLeft: `3px solid ${styles.color}`
              }}>
                <p style={{ margin: 0, color: '#475569', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  <strong style={{ color: styles.color, marginRight: '4px' }}>Suggested Fix:</strong> 
                  {item.fix}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          padding: '1.5rem', 
          textAlign: 'center', 
          backgroundColor: 'rgba(255, 255, 255, 0.2)', 
          borderRadius: '16px',
          border: '1px dashed rgba(99, 102, 241, 0.2)'
        }}>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#10b981" /> No {title.toLowerCase()} detected
          </p>
        </div>
      )}
    </div>
  );
};

export default IssueList;

