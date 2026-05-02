import { useState, useEffect } from 'react';
import axios from 'axios';
import IssueList from '../components/IssueList';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Trash2, Calendar, FileCode, Check, Copy } from 'lucide-react';

/**
 * ScoreRing component — renders a refined circular progress bar for the quality score.
 */
const ScoreRing = ({ score }) => {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const percentage = (score || 0) * 10;
  const offset = circumference - (percentage / 100) * circumference;
  
  const getColor = (s) => {
    if (s >= 8) return '#10b981';
    if (s >= 5) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}>
      <svg width="40" height="40" viewBox="0 0 40 40" style={{ transform: 'rotate(-90deg)' }}>
        <circle 
          cx="20" cy="20" r={radius} 
          fill="transparent" stroke="rgba(0,0,0,0.05)" strokeWidth="3" 
        />
        <circle 
          cx="20" cy="20" r={radius} 
          fill="transparent" 
          stroke={getColor(score)} 
          strokeWidth="3" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <span style={{ position: 'absolute', fontSize: '0.75rem', fontWeight: '800', color: getColor(score) }}>
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
        if (activeReviewId === id) setActiveReviewId(null);
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
    if (s >= 8) return '#10b981';
    if (s >= 5) return '#f59e0b';
    return '#ef4444';
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
    if (match) cleaned = match[1];
    cleaned = cleaned.replace(/\\n/g, '\n').replace(/\\t/g, '    ').replace(/\\r/g, '');
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

  if (loading) return <main style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Loading history...</main>;
  if (error) return <main style={{ padding: '4rem' }}><div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div></main>;

  const activeReview = reviews.find(r => r._id === activeReviewId);

  return (
    <main style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
      <div className={`history-layout ${activeReviewId ? 'has-active' : ''}`} style={{ 
        display: 'grid', 
        gridTemplateColumns: activeReviewId ? '350px 1fr' : '1fr',
        gap: '2rem',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        
        {/* Column 1: History Sidebar */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(238, 242, 255, 0.6) 100%)',
          backdropFilter: 'blur(24px)',
          borderRadius: '24px',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5)',
          padding: '1.5rem',
          height: 'fit-content',
          maxHeight: 'calc(100vh - 150px)',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
            <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem', fontWeight: '800' }}>Past Reviews</h3>
            {reviews.length > 0 && (
              <button 
                onClick={handleDeleteAll}
                style={{ 
                  background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.2)',
                  padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)'}
              >
                Clear All
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {reviews.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', padding: '2rem 0' }}>No history found.</p>
            ) : (
              reviews.map((review) => {
                const score = review.suggestions?.score || 0;
                const date = new Date(review.createdAt).toLocaleDateString();
                const isActive = activeReviewId === review._id;

                return (
                  <div 
                    key={review._id} 
                    onClick={() => setActiveReviewId(review._id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '1rem', borderRadius: '16px', cursor: 'pointer',
                      background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.4)',
                      border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(255, 255, 255, 0.5)',
                      transition: 'all 0.2s ease',
                      transform: isActive ? 'translateX(4px)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)';
                        e.currentTarget.style.transform = 'none';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ color: '#4f46e5', fontWeight: '800', fontSize: '0.9rem' }}>{review.language}</span>
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> {date}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ScoreRing score={score} />
                      <button 
                        onClick={(e) => handleDelete(e, review._id)}
                        style={{ 
                          background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#f43f5e'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Dashboard Content (Visible only when a record is active) */}
        <div style={{ display: activeReviewId ? 'flex' : 'none', flexDirection: 'column', gap: '2rem' }}>
          {activeReview && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              
              {/* Column 2: Analysis Dashboard */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(238, 242, 255, 0.6) 100%)',
                  backdropFilter: 'blur(24px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  padding: '1.5rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Quality Score</span>
                  <div style={{ 
                    fontSize: '1.75rem', fontWeight: '900', color: getScoreClass(activeReview.suggestions?.score || 0)
                  }}>
                    {(activeReview.suggestions?.score || 0) * 10}<span style={{ fontSize: '1rem', color: '#94a3b8' }}>/100</span>
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(238, 242, 255, 0.6) 100%)',
                  backdropFilter: 'blur(24px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  padding: '1.5rem',
                  maxHeight: 'calc(100vh - 250px)',
                  overflowY: 'auto'
                }}>
                  <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b', fontSize: '1rem', fontWeight: '800', borderBottom: '1px solid rgba(99, 102, 241, 0.1)', paddingBottom: '0.75rem' }}>Bugs & Suggestions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <IssueList title="Critical Bugs" items={activeReview.suggestions?.bugs} type="bug" />
                    <IssueList title="Security Issues" items={activeReview.suggestions?.issues} type="issue" />
                    <IssueList title="Performance" items={activeReview.suggestions?.performance} type="performance" />
                    <IssueList title="Improvements" items={activeReview.suggestions?.improvements} type="improvement" />
                  </div>
                </div>
              </div>

              {/* Column 3: Code Comparison Dashboard */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Original Source */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(238, 242, 255, 0.6) 100%)',
                  backdropFilter: 'blur(24px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  padding: '1.5rem',
                  flex: 1,
                  display: 'flex', flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, color: '#4f46e5', fontSize: '0.9rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}><FileCode size={16}/> Original Source</h3>
                    <button 
                      onClick={() => handleCopy(activeReview.code, 'code')}
                      style={{ background: 'rgba(99, 102, 241, 0.1)', border: 'none', color: '#4f46e5', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      {copiedCode ? <Check size={14}/> : <Copy size={14}/>}
                    </button>
                  </div>
                  <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', overflow: 'hidden', flex: 1 }}>
                    <SyntaxHighlighter
                      language={getLanguageAlias(activeReview.language)}
                      style={vscDarkPlus}
                      customStyle={{ margin: 0, padding: '1rem', fontSize: '0.75rem', backgroundColor: 'transparent', height: '100%' }}
                    >
                      {activeReview.code || ''}
                    </SyntaxHighlighter>
                  </div>
                </div>

                {/* Refactored Result */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(238, 242, 255, 0.6) 100%)',
                  backdropFilter: 'blur(24px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  padding: '1.5rem',
                  flex: 1,
                  display: 'flex', flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, color: '#10b981', fontSize: '0.9rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}><FileCode size={16}/> Refactored Result</h3>
                    <button 
                      onClick={() => handleCopy(cleanCode(activeReview.suggestions.refactored_code), 'refactor')}
                      style={{ background: 'rgba(16, 185, 129, 0.1)', border: 'none', color: '#10b981', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      {copiedRefactor ? <Check size={14}/> : <Copy size={14}/>}
                    </button>
                  </div>
                  <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', overflow: 'hidden', flex: 1 }}>
                    <SyntaxHighlighter
                      language={getLanguageAlias(activeReview.language)}
                      style={vscDarkPlus}
                      customStyle={{ margin: 0, padding: '1rem', fontSize: '0.75rem', backgroundColor: 'transparent', height: '100%' }}
                    >
                      {cleanCode(activeReview.suggestions.refactored_code)}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default HistoryPage;
