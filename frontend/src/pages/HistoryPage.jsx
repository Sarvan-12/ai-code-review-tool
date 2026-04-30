import { useState, useEffect } from 'react';
import axios from 'axios';
import IssueList from '../components/IssueList';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * ScoreRing component — renders a circular progress bar for the quality score.
 */
const ScoreRing = ({ score }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const percentage = (score || 0) * 10;
  const offset = circumference - (percentage / 100) * circumference;
  
  const getColor = (s) => {
    if (s >= 8) return '#10b981'; // Success
    if (s >= 5) return '#f59e0b'; // Warning
    return '#ef4444'; // Danger
  };

  return (
    <div className="score-ring-container">
      <svg className="score-ring-svg" viewBox="0 0 45 45">
        <circle className="score-ring-bg" cx="22.5" cy="22.5" r={radius} />
        <circle 
          className="score-ring-progress" 
          cx="22.5" 
          cy="22.5" 
          r={radius} 
          style={{ 
            strokeDasharray: circumference, 
            strokeDashoffset: offset,
            stroke: getColor(score)
          }} 
        />
      </svg>
      <span className="score-ring-text" style={{ color: getColor(score) }}>
        {percentage}
      </span>
    </div>
  );
};

function HistoryPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' or 'comparison'
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedRefactor, setCopiedRefactor] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/reviews');
        setReviews(response.data.data);
      } catch {
        setError('Failed to load history.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Reset to analysis tab when switching records
  useEffect(() => {
    if (activeReviewId) {
      setActiveTab('analysis');
    }
  }, [activeReviewId]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this review history?")) {
      try {
        await axios.delete(`/api/history/${id}`);
        setReviews(reviews.filter(r => r._id !== id));
        if (activeReviewId === id) {
          setActiveReviewId(null);
        }
      } catch (err) {
        alert("Failed to delete history item.");
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("CRITICAL: This will permanently delete ALL review history. Are you sure?")) {
      try {
        await axios.delete('/api/history/all');
        setReviews([]);
        setActiveReviewId(null);
      } catch (err) {
        alert("Failed to clear history.");
      }
    }
  };

  const getScoreClass = (s) => {
    if (s >= 8) return 'score-high';
    if (s >= 5) return 'score-mid';
    return 'score-low';
  };

  const getLanguageAlias = (lang) => {
    if (!lang) return 'plaintext';
    const l = lang.toLowerCase();
    if (l === 'c++') return 'cpp';
    if (l === 'c#') return 'csharp';
    return l;
  };

  const cleanCode = (code) => {
    if (!code) return '';
    let cleaned = code;
    const backtickRegex = /```(?:[a-z]*)\n?([\s\S]*?)```/i;
    const match = code.match(backtickRegex);
    if (match) {
      cleaned = match[1];
    } else {
      const codeStartRegex = /(?:^|\n)(?:\s*)(?:#include|import|from|public|private|class|function|def|const|let|var|using|package)\s+/i;
      const startIndex = cleaned.search(codeStartRegex);
      if (startIndex !== -1) {
        cleaned = cleaned.substring(startIndex);
      }
    }
    cleaned = cleaned
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '    ')
      .replace(/\\r/g, '');
    return cleaned.trim();
  };

  const handleCopy = (text, type) => {
    if (text) {
      navigator.clipboard.writeText(text);
      if (type === 'code') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedRefactor(true);
        setTimeout(() => setCopiedRefactor(false), 2000);
      }
    }
  };

  if (loading) return <main><p>Loading history...</p></main>;
  if (error) return <main><div className="error-box">{error}</div></main>;

  const activeReview = reviews.find(r => r._id === activeReviewId);

  return (
    <main>
      <div className={`history-layout ${activeReviewId ? 'has-active' : ''}`}>
        
        {/* Column 1: History Sidebar */}
        <div className="history-sidebar">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="dashboard-panel-title" style={{ marginBottom: 0 }}>Past Reviews</h3>
            {reviews.length > 0 && (
              <button 
                onClick={handleDeleteAll}
                className="btn-clear-corner"
                style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                title="Clear all history"
              >
                🗑️ Clear All
              </button>
            )}
          </div>

          {reviews.map((review) => {
            const score = review.suggestions?.score || 0;
            const date = new Date(review.createdAt).toLocaleDateString();
            const isActive = activeReviewId === review._id;

            return (
              <div 
                key={review._id} 
                className={`history-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveReviewId(review._id)}
              >
                <div className="history-item-header">
                  <span className="history-item-lang">{review.language}</span>
                  <span className="history-item-date">{date}</span>
                </div>
                
                <div className="history-item-right">
                  <ScoreRing score={score} />
                  <button 
                    className="btn-delete-history"
                    onClick={(e) => handleDelete(e, review._id)}
                    title="Delete History"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dashoard Content (Visible only when a record is active) */}
        <div className="history-content">
          {activeReview && (
            <>
              {/* Column 2: Analysis Dashboard */}
              <div className="dashboard-col">
                <div className="dashboard-panel" style={{ flex: '0 0 auto' }}>
                  <span className="dashboard-panel-title">Quality Score</span>
                  <div className="score-container" style={{ marginBottom: 0, padding: '0.5rem 0' }}>
                    <div className={`score-badge ${getScoreClass(activeReview.suggestions?.score || 0)}`}>
                      {(activeReview.suggestions?.score || 0) * 10}/100
                    </div>
                  </div>
                </div>

                <div className="dashboard-panel" style={{ flex: '1 1 auto' }}>
                  <span className="dashboard-panel-title">Bugs & Suggestions</span>
                  <div className="scrollable-panel-content">
                    <IssueList title="Critical Bugs" items={activeReview.suggestions?.bugs} type="bug" />
                    <IssueList title="Security Issues" items={activeReview.suggestions?.issues} type="issue" />
                    <IssueList title="Performance" items={activeReview.suggestions?.performance} type="performance" />
                    <IssueList title="Improvements" items={activeReview.suggestions?.improvements} type="improvement" />
                  </div>
                </div>
              </div>

              {/* Column 3: Code Comparison Dashboard */}
              <div className="dashboard-col">
                <div className="dashboard-panel" style={{ flex: '1 1 50%' }}>
                  <span className="dashboard-panel-title">Original Source</span>
                  <div className="refactored-code-container" style={{ height: '100%' }}>
                    <button className="btn-copy" onClick={() => handleCopy(activeReview.code, 'code')}>
                      {copiedCode ? '✅' : '📋'}
                    </button>
                    <div className="syntax-highlighter-wrapper">
                      <SyntaxHighlighter
                        language={getLanguageAlias(activeReview.language)}
                        style={vscDarkPlus}
                        wrapLongLines={true}
                        customStyle={{
                          margin: 0,
                          padding: '1.25rem',
                          fontSize: '0.8rem',
                          backgroundColor: '#000000',
                          lineHeight: '1.5',
                          height: '100%'
                        }}
                      >
                        {activeReview.code || 'No code provided.'}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>

                <div className="dashboard-panel" style={{ flex: '1 1 50%' }}>
                  <span className="dashboard-panel-title">Refactored Result</span>
                  <div className="refactored-code-container" style={{ height: '100%' }}>
                    <button className="btn-copy" onClick={() => handleCopy(cleanCode(activeReview.suggestions.refactored_code), 'refactor')}>
                      {copiedRefactor ? '✅' : '📋'}
                    </button>
                    <div className="syntax-highlighter-wrapper">
                      <SyntaxHighlighter
                        language={getLanguageAlias(activeReview.language)}
                        style={vscDarkPlus}
                        wrapLongLines={true}
                        customStyle={{
                          margin: 0,
                          padding: '1.25rem',
                          fontSize: '0.8rem',
                          backgroundColor: '#000000',
                          lineHeight: '1.5',
                          height: '100%'
                        }}
                      >
                        {cleanCode(activeReview.suggestions.refactored_code)}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default HistoryPage;
