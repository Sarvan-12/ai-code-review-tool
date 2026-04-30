import { useState, useEffect } from 'react';
import axios from 'axios';
import IssueList from '../components/IssueList';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function HistoryPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeReviewId, setActiveReviewId] = useState(null);
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
      <h2 className="section-title">Review History</h2>
      
      {reviews.length === 0 ? (
        <p className="empty-message">No past reviews found.</p>
      ) : (
        <div className="history-layout">
          {/* Left Sidebar */}
          <div className="history-sidebar">
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
                  <div className="history-item-content">
                    <div className="history-item-header">
                      <span className="history-item-lang">{review.language}</span>
                      <span className="history-item-date">{date}</span>
                    </div>
                    <div className={`history-item-score ${getScoreClass(score)}`}>
                      Score: {score * 10}/100
                    </div>
                  </div>
                  <button 
                    className="btn-delete-history"
                    onClick={(e) => handleDelete(e, review._id)}
                    title="Delete History"
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right Content Panel */}
          <div className="history-content">
            {!activeReview ? (
              <div className="history-empty-state">
                Select a review history to view details
              </div>
            ) : (
              <div className="history-detail-view">
                
                {/* Score Section */}
                <div className="card">
                  <div className="score-container">
                    <p className="score-label">Code Quality Score</p>
                    <div className={`score-badge ${getScoreClass(activeReview.suggestions?.score || 0)}`}>
                      {(activeReview.suggestions?.score || 0) * 10}/100
                    </div>
                  </div>
                </div>

                {/* Original Source Code */}
                <div className="card original-code-section">
                  <h3 className="section-title">📄 Original Source Code</h3>
                  <div className="refactored-code-container">
                    <button
                      className="btn-copy"
                      onClick={() => handleCopy(activeReview.code, 'code')}
                      title="Copy code to clipboard"
                    >
                      {copiedCode ? '✅ Copied!' : '📋 Copy Code'}
                    </button>
                    <div className="syntax-highlighter-wrapper">
                      <SyntaxHighlighter
                        language={getLanguageAlias(activeReview.language)}
                        style={vscDarkPlus}
                        wrapLongLines={true}
                        customStyle={{
                          margin: 0,
                          padding: '1.5rem',
                          fontSize: '0.9rem',
                          backgroundColor: '#020617',
                          borderRadius: '8px',
                          border: '1px solid #334155',
                          lineHeight: '1.5',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}
                      >
                        {activeReview.code || 'No code provided.'}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>

                {/* Review Results */}
                <div className="card">
                  <IssueList title="Critical Bugs" items={activeReview.suggestions?.bugs} type="bug" />
                  <IssueList title="Security & Logic Issues" items={activeReview.suggestions?.issues} type="issue" />
                  <IssueList title="Performance Optimizations" items={activeReview.suggestions?.performance} type="performance" />
                  <IssueList title="Improvements & Best Practices" items={activeReview.suggestions?.improvements} type="improvement" />
                </div>

                {/* Refactored Code */}
                <div className="card refactor-section">
                  <h3 className="section-title">🛠️ Refactored Code</h3>
                  {activeReview.suggestions?.refactored_code ? (
                    <div className="refactored-code-container">
                      <button
                        className="btn-copy"
                        onClick={() => handleCopy(cleanCode(activeReview.suggestions.refactored_code), 'refactor')}
                        title="Copy code to clipboard"
                      >
                        {copiedRefactor ? '✅ Copied!' : '📋 Copy Code'}
                      </button>
                      <div className="syntax-highlighter-wrapper">
                        <SyntaxHighlighter
                          language={getLanguageAlias(activeReview.language)}
                          style={vscDarkPlus}
                          wrapLongLines={true}
                          customStyle={{
                            margin: 0,
                            padding: '1.5rem',
                            fontSize: '0.9rem',
                            backgroundColor: '#020617',
                            borderRadius: '8px',
                            border: '1px solid #334155',
                            lineHeight: '1.5',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                          }}
                        >
                          {cleanCode(activeReview.suggestions.refactored_code)}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  ) : (
                    <p className="empty-message">No refactored code available</p>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default HistoryPage;
