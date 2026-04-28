import { useState, useEffect } from 'react';
import axios from 'axios';
import IssueList from '../components/IssueList';

function HistoryPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);

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

  const toggleExpand = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const getScoreClass = (s) => {
    if (s >= 8) return 'score-high';
    if (s >= 5) return 'score-mid';
    return 'score-low';
  };

  if (loading) return <main><p>Loading history...</p></main>;
  if (error) return <main><div className="error-box">{error}</div></main>;

  return (
    <main>
      <h2 className="section-title">Review History</h2>
      {reviews.length === 0 ? (
        <p className="empty-message">No past reviews found.</p>
      ) : (
        <div className="history-list">
          {reviews.map((review) => {
            const isExpanded = openId === review._id;
            const score = review.suggestions?.score || 0;
            const date = new Date(review.createdAt).toLocaleDateString();

            return (
              <div key={review._id} className="card history-card">
                <div 
                  className="history-header" 
                  onClick={() => toggleExpand(review._id)}
                >
                  <div className="history-info">
                    <span className="history-lang">{review.language}</span>
                    <span className={`history-score-badge ${getScoreClass(score)}`}>
                      Score: {score * 10}
                    </span>
                    <span className="history-date">{date}</span>
                  </div>
                  <div className={`history-arrow ${isExpanded ? 'expanded' : ''}`}>
                    &#9654;
                  </div>
                </div>

                {isExpanded && review.suggestions && (
                  <div className="history-details">
                    <IssueList title="Critical Bugs" items={review.suggestions.bugs} type="bug" />
                    <IssueList title="Security & Logic Issues" items={review.suggestions.issues} type="issue" />
                    <IssueList title="Performance Optimizations" items={review.suggestions.performance} type="performance" />
                    <IssueList title="Improvements & Best Practices" items={review.suggestions.improvements} type="improvement" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default HistoryPage;
